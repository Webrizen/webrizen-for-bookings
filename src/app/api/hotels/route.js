import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RoomType from '@/models/RoomType';

export async function GET(req) {
    await dbConnect();
    try {
        const roomTypes = await RoomType.find({});
        return NextResponse.json({ success: true, data: roomTypes });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
