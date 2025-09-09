import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Venue from '@/models/Venue';

export async function GET(req, { params }) {
    await dbConnect();
    try {
        const venue = await Venue.findById(params.id);
        if (!venue) {
            return NextResponse.json({ success: false, message: 'Venue not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: venue });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
