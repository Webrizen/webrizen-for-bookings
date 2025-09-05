import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';

// Get a single order
export async function GET(req, { params }) {
    await dbConnect();
    try {
        const order = await Order.findById(params.id).populate('user', 'name email');
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update an order
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const order = await Order.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: order });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
