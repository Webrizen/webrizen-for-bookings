import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkProduct from '@/models/ParkProduct';

export async function GET(req) {
    await dbConnect();
    try {
        const parkProducts = await ParkProduct.find({});
        return NextResponse.json({ success: true, data: parkProducts });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
