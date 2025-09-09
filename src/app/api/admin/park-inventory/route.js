import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkInventory from '@/models/ParkInventory';
import ParkProduct from '@/models/ParkProduct';

// Get inventory for a specific date
export async function GET(req) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ success: false, message: 'Date is required' }, { status: 400 });
        }

        const inventories = await ParkInventory.find({ date: new Date(new Date(date).setHours(0,0,0,0)) })
            .populate('parkProduct', 'name');

        return NextResponse.json({ success: true, data: inventories });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}


// Add or update park inventory
export async function POST(req) {
    await dbConnect();
    try {
        const { parkProductId, date, totalTickets, availableTickets } = await req.json();

        const inventory = await ParkInventory.findOneAndUpdate(
            { parkProduct: parkProductId, date: new Date(new Date(date).setHours(0,0,0,0)) },
            { totalTickets, availableTickets },
            { new: true, upsert: true, runValidators: true }
        );

        return NextResponse.json({ success: true, data: inventory });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
