import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkProduct from '@/models/ParkProduct';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const parkProduct = await ParkProduct.findById(params.id);
        if (!parkProduct) {
            return NextResponse.json({ success: false, message: 'Park product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: parkProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
