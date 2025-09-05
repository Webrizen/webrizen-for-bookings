import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Cart from '@/models/Cart';
import { checkVenueAvailability, checkRoomAvailability, checkParkAvailability } from '@/lib/availability';

// Get user's cart
export async function GET(req) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            return NextResponse.json({ success: true, data: { items: [], user: userId } });
        }

        return NextResponse.json({ success: true, data: cart });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Add item to cart
export async function POST(req) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const body = await req.json();
        const { productType, product: productId, quantity, price, ...otherDetails } = body;

        // --- Availability Check ---
        if (productType === 'Venue') {
            const { eventDate, slot } = otherDetails;
            const availableSlots = await checkVenueAvailability(productId, eventDate);
            const requestedSlot = `${slot.startTime}-${slot.endTime}`;
            const isAvailable = availableSlots.some(s => `${s.startTime}-${s.endTime}` === requestedSlot);
            if (!isAvailable) {
                return NextResponse.json({ success: false, message: 'The selected slot is not available.' }, { status: 400 });
            }
        } else if (productType === 'RoomType') {
            const { checkInDate, checkOutDate } = otherDetails;
            const roomAvailability = await checkRoomAvailability(productId, checkInDate, checkOutDate);
            const isAvailable = roomAvailability.every(day => day.available >= quantity);
            if (!isAvailable) {
                return NextResponse.json({ success: false, message: 'Not enough rooms available for the selected dates.' }, { status: 400 });
            }
        } else if (productType === 'ParkProduct') {
            const { visitDate } = otherDetails;
            const parkAvailability = await checkParkAvailability(productId, visitDate);
            if (parkAvailability.availableTickets < quantity) {
                return NextResponse.json({ success: false, message: 'Not enough park tickets available for the selected date.' }, { status: 400 });
            }
        }
        // --- End Availability Check ---

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const newItem = { productType, product: productId, quantity, price, ...otherDetails };
        cart.items.push(newItem);

        await cart.save();
        const newCart = await cart.populate('items.product');
        return NextResponse.json({ success: true, data: newCart });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Update item in cart
export async function PUT(req) {
    await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const { cartItemId, quantity } = await req.json();

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
        }

        const item = cart.items.id(cartItemId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
            const updatedCart = await cart.populate('items.product');
            return NextResponse.json({ success: true, data: updatedCart });
        } else {
            return NextResponse.json({ success: false, message: 'Item not found in cart' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Remove item from cart
export async function DELETE(req) {
     await dbConnect();
    try {
        const userId = req.headers.get('x-user-id');
        const { cartItemId } = await req.json();

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return NextResponse.json({ success: false, message: 'Cart not found' }, { status: 404 });
        }

        cart.items.id(cartItemId).deleteOne();

        await cart.save();
        const updatedCart = await cart.populate('items.product');

        return NextResponse.json({ success: true, data: updatedCart });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
