import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ParkProduct from '@/models/ParkProduct';

// Get a single park product
export async function GET(req, { params }) {
    await dbConnect();
    try {
        const parkProduct = await ParkProduct.findById(params.id);
        if (!parkProduct) {
            return NextResponse.json({ success: false, message: 'Park product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: parkProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update a park product
export async function PUT(req, { params }) {
    await dbConnect();
    try {
        const body = await req.json();
        const parkProduct = await ParkProduct.findByIdAndUpdate(params.id, body, {
            new: true,
            runValidators: true,
        });
        if (!parkProduct) {
            return NextResponse.json({ success: false, message: 'Park product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: parkProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Delete a park product
export async function DELETE(req, { params }) {
    await dbConnect();
    try {
        const deletedParkProduct = await ParkProduct.deleteOne({ _id: params.id });
        if (deletedParkProduct.deletedCount === 0) {
            return NextResponse.json({ success: false, message: 'Park product not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
