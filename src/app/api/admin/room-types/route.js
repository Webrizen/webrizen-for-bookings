import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RoomType from '@/models/RoomType';

// Get all room types
export async function GET(req) {
    await dbConnect();
    try {
        const roomTypes = await RoomType.find({});
        return NextResponse.json({ success: true, data: roomTypes });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Create a new room type
export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const roomType = await RoomType.create(body);
        return NextResponse.json({ success: true, data: roomType }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
