import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkProduct from '@/models/ParkProduct';

// Get all park products
export async function GET(req) {
    await dbConnect();
    try {
        const parkProducts = await ParkProduct.find({});
        return NextResponse.json({ success: true, data: parkProducts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Create a new park product
export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const parkProduct = await ParkProduct.create(body);
        return NextResponse.json({ success: true, data: parkProduct }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
