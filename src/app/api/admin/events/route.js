import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

// Get all events
export async function GET(req) {
    await dbConnect();
    try {
        const events = await Event.find({}).populate('user', 'name email').populate('venue', 'name');
        return NextResponse.json({ success: true, data: events });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
