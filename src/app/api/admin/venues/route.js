import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Venue from '@/models/Venue';

// Get all venues
export async function GET(req) {
    await dbConnect();
    try {
        const venues = await Venue.find({});
        return NextResponse.json({ success: true, data: venues });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Create a new venue
export async function POST(req) {
    await dbConnect();
    try {
        const body = await req.json();
        const venue = await Venue.create(body);
        return NextResponse.json({ success: true, data: venue }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
