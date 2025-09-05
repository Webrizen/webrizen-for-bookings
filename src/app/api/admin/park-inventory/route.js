import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkInventory from '@/models/ParkInventory';

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
