import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RoomType from '@/models/RoomType';

// Get a single room type
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

// Update a room type
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const roomType = await RoomType.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!roomType) {
            return NextResponse.json({ success: false, message: 'Room type not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: roomType });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Delete a room type
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const deletedRoomType = await RoomType.deleteOne({ _id: params.id });
        if (deletedRoomType.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Room type not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
