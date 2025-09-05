import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Venue from '@/models/Venue';

// Get a single venue
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

// Update a venue
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const venue = await Venue.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!venue) {
            return NextResponse.json({ success: false, message: 'Venue not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: venue });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Delete a venue
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const deletedVenue = await Venue.deleteOne({ _id: params.id });
        if (deletedVenue.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Venue not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
