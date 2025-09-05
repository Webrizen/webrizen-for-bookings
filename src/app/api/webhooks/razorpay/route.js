import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Payment from '@/models/Payment';
import crypto from 'crypto';

export async function POST(req) {
    await dbConnect();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    try {
        const body = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(body);
        const digest = shasum.digest('hex');

        if (digest === signature) {
            const event = JSON.parse(body);
            const { entity, event: eventType } = event;

            if (eventType === 'payment.captured' || eventType === 'order.paid') {
                const payment = event.payload.payment.entity;
                const orderId = payment.notes.order_id;

                await Order.findByIdAndUpdate(orderId, { status: 'paid' });

                await Payment.findOneAndUpdate(
                    { razorpayPaymentId: payment.id },
                    { status: 'captured' },
                    { upsert: true, new: true }
                );
            } else if (eventType === 'payment.failed') {
                const payment = event.payload.payment.entity;
                const orderId = payment.notes.order_id;

                await Order.findByIdAndUpdate(orderId, { status: 'failed' });

                await Payment.findOneAndUpdate(
                    { razorpayPaymentId: payment.id },
                    { status: 'failed' },
                    { upsert: true, new: true }
                );
            }
            // Handle other events like refunds etc.

            return NextResponse.json({ status: 'ok' });
        } else {
            return new NextResponse('Invalid signature', { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ status: 'error', error: error.message }, { status: 400 });
    }
}
