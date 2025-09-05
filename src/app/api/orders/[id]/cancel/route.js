import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import Setting from '@/models/Setting';
import Razorpay from 'razorpay';
// import { sendCancellationEmail } from '@/lib/email';

export async function POST(req, { params }) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const orderId = params.id;

        const order = await Order.findOne({ _id: orderId, user: userId }).populate('user');

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found or you are not authorized' }, { status: 404 });
        }

        if (order.status !== 'paid') {
            return NextResponse.json({ success: false, message: 'Only paid orders can be cancelled' }, { status: 400 });
        }

        const cancellationPolicySetting = await Setting.findOne({ key: 'cancellationPolicy' });
        if (!cancellationPolicySetting) {
            return NextResponse.json({ success: false, message: 'Cancellation policy not defined' }, { status: 500 });
        }
        const cancellationPolicy = cancellationPolicySetting.value;

        const eventDateItem = order.items.find(item => item.eventDate || item.checkInDate || item.visitDate);
        if (!eventDateItem) {
            return NextResponse.json({ success: false, message: 'Cannot determine event date for cancellation' }, { status: 400 });
        }
        const eventDate = new Date(eventDateItem.eventDate || eventDateItem.checkInDate || eventDateItem.visitDate);
        const now = new Date();
        const daysBefore = (eventDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

        let refundPercentage = 0;
        for (const rule of cancellationPolicy.sort((a, b) => b.days - a.days)) {
            if (daysBefore >= rule.days) {
                refundPercentage = rule.percentage;
                break;
            }
        }

        const refundAmount = (order.totalAmount * refundPercentage) / 100;

        if (refundAmount > 0) {
            const payment = await Payment.findOne({ order: orderId });
            if (!payment) {
                return NextResponse.json({ success: false, message: 'Payment record not found for this order' }, { status: 500 });
            }

            const instance = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            await instance.payments.refund(payment.razorpayPaymentId, {
                amount: refundAmount * 100,
                speed: 'normal',
                notes: {
                    reason: 'Customer cancellation'
                }
            });
        }

        order.status = 'cancelled';
        await order.save();

        try {
            await sendCancellationEmail(order.user, order, refundAmount);
        } catch (emailError) {
            console.error("Failed to send cancellation email:", emailError);
        }

        return NextResponse.json({ success: true, message: `Order cancelled. A refund of INR ${refundAmount} has been initiated.` });

    } catch (error) {
        // Check for Razorpay specific errors
        if (error.statusCode) {
             return NextResponse.json({ success: false, error: error.error.description }, { status: error.statusCode });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
