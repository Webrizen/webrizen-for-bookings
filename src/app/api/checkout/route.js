import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Cart from '@/models/Cart';
import Order from '@/models/Order';
import Razorpay from 'razorpay';
import shortid from 'shortid';

export async function POST(req) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return NextResponse.json({ success: false, message: 'Cart is empty' }, { status: 400 });
        }

        let totalAmount = 0;
        cart.items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        const order = await Order.create({
            user: userId,
            items: cart.items,
            totalAmount: totalAmount,
        });

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: totalAmount * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: shortid.generate(),
            notes: {
                order_id: order._id.toString()
            }
        };

        const razorpayOrder = await instance.orders.create(options);

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        // Clear cart after creating order
        await Cart.findByIdAndDelete(cart._id);

        return NextResponse.json({ success: true, data: { orderId: razorpayOrder.id, amount: razorpayOrder.amount } });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
