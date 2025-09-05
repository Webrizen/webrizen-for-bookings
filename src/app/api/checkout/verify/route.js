import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import User from '@/models/User';
import crypto from 'crypto';
import { sendBookingConfirmationEmail, sendPaymentReceiptEmail } from '@/lib/email';

export async function POST(req) {
    await dbConnect();
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id }).populate('user');
            if (!order) {
                return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
            }

            if (order.status !== 'paid') {
                order.status = 'paid';
                await order.save();

                const payment = await Payment.create({
                    order: order._id,
                    razorpayPaymentId: razorpay_payment_id,
                    razorpayOrderId: razorpay_order_id,
                    razorpaySignature: razorpay_signature,
                    amount: order.totalAmount,
                    status: 'captured'
                });

                // Send emails
                try {
                    await sendBookingConfirmationEmail(order.user, order);
                    await sendPaymentReceiptEmail(order.user, payment);
                } catch (emailError) {
                    console.error("Failed to send email:", emailError);
                    // Don't block the response for email failure
                }
            }

            return NextResponse.json({ success: true, message: 'Payment verified successfully' });
        } else {
            return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
