import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RoomType from '@/models/RoomType';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const roomType = await RoomType.findById(params.id);
        if (!roomType) {
            return NextResponse.json({ success: false, message: 'Room type not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: roomType });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
