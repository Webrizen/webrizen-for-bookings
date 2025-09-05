import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

// Get a single coupon
export async function GET(req, { params }) {
    await dbConnect();
    try {
        const coupon = await Coupon.findById(params.id);
        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update a coupon
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const coupon = await Coupon.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!coupon) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: coupon });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Delete a coupon
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const deletedCoupon = await Coupon.deleteOne({ _id: params.id });
        if (deletedCoupon.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Coupon not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
