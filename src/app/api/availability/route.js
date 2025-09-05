import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { checkVenueAvailability, checkRoomAvailability, checkParkAvailability } from '@/lib/availability';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const module = searchParams.get('module');
  const date = searchParams.get('date');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const venueId = searchParams.get('venueId');
  const roomTypeId = searchParams.get('roomTypeId');
  const parkProductId = searchParams.get('parkProductId');

  try {
    if (module === 'venue') {
      if (!date || !venueId) {
        return NextResponse.json(
          { success: false, message: 'Please provide date and venueId' },
          { status: 400 }
        );
      }
      const availableSlots = await checkVenueAvailability(venueId, date);
      return NextResponse.json({ success: true, data: { availableSlots } });

    } else if (module === 'room') {
      if (!startDate || !endDate || !roomTypeId) {
        return NextResponse.json(
          { success: false, message: 'Please provide startDate, endDate and roomTypeId' },
          { status: 400 }
        );
      }
      const availability = await checkRoomAvailability(roomTypeId, startDate, endDate);
      return NextResponse.json({ success: true, data: availability });

    } else if (module === 'park') {
        if (!date || !parkProductId) {
            return NextResponse.json(
              { success: false, message: 'Please provide date and parkProductId' },
              { status: 400 }
            );
        }
        const { availableTickets } = await checkParkAvailability(parkProductId, date);
        return NextResponse.json({ success: true, data: { availableTickets } });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid module' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
