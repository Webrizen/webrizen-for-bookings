import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

// Get a single setting by key
export async function GET(req, { params }) {
    await dbConnect();
    try {
        const setting = await Setting.findOne({ key: params.key });
        if (!setting) {
            return NextResponse.json({ success: false, message: 'Setting not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: setting });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update a setting by key
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const { value } = await req.json();
        const setting = await Setting.findOneAndUpdate({ key: params.key }, { value }, {
            new: true,
            runValidators: true,
        });
        if (!setting) {
            return NextResponse.json({ success: false, message: 'Setting not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: setting });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
