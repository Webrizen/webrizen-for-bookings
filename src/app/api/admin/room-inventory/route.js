import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import RoomInventory from '@/models/RoomInventory';
import RoomType from '@/models/RoomType';

// Get inventory for a specific date
export async function GET(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
        }

        const inventories = await RoomInventory.find({ date: new Date(new Date(date).setHours(0,0,0,0)) })
            .populate('roomType', 'name');

        return NextResponse.json({ success: true, data: inventories });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}


// Add or update room inventory
export async function POST(req) {
    await dbConnect();
    try {
        const { roomTypeId, date, totalRooms, availableRooms } = await req.json();

        const inventory = await RoomInventory.findOneAndUpdate(
            { roomType: roomTypeId, date: new Date(new Date(date).setHours(0,0,0,0)) },
            { totalRooms, availableRooms },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: inventory });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
