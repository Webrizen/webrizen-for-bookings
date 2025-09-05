import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

// Get all settings
export async function GET(req) {
    await dbConnect();
    try {
        const settings = await Setting.find({});
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Create or update a setting
export async function POST(req) {
    await dbConnect();
    try {
        const { key, value } = await req.json();
        const setting = await Setting.findOneAndUpdate({ key }, { value }, {
            new: true,
            upsert: true,
            runValidators: true,
        });
        return NextResponse.json({ success: true, data: setting });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
