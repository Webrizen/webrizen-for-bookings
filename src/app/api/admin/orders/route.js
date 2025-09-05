import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

// Get all orders
export async function GET(req) {
    await dbConnect();
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
