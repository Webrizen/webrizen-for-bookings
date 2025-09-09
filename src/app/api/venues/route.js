import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Venue from '@/models/Venue';

export async function GET(req) {
    await dbConnect();
    try {
        const venues = await Venue.find({});
        return NextResponse.json({ success: true, data: venues });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
