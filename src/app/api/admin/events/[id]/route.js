import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

// Get a single event
export async function GET(req, { params }) {
    await dbConnect();
    try {
        const event = await Event.findById(params.id).populate('user', 'name email').populate('venue', 'name');
        if (!event) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update an event
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const event = await Event.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!event) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: event });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Delete an event
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const deletedEvent = await Event.deleteOne({ _id: params.id });
        if (deletedEvent.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
