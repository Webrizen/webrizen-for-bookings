import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

// Get all coupons
export async function GET(req) {
    await dbConnect();
    try {
        const coupons = await Coupon.find({});
        return NextResponse.json({ success: true, data: coupons });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Create a new coupon
export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const coupon = await Coupon.create(body);
        return NextResponse.json({ success: true, data: coupon }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
