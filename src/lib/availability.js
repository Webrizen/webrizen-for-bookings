import Event from '@/models/Event';
import RoomInventory from '@/models/RoomInventory';
import ParkInventory from '@/models/ParkInventory';
import Venue from '@/models/Venue';

export async function checkVenueAvailability(venueId, date) {
    const venue = await Venue.findById(venueId);
    if (!venue) {
        throw new Error('Venue not found');
    }

    const events = await Event.find({ venue: venueId, eventDate: new Date(date) });
    const bookedSlots = events.map(event => `${event.slot.startTime}-${event.slot.endTime}`);

    const allSlots = venue.slots.map(slot => `${slot.startTime}-${slot.endTime}`);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot)).map(slot => {
        const [startTime, endTime] = slot.split('-');
        return { startTime, endTime };
    });

    return availableSlots;
}

export async function checkRoomAvailability(roomTypeId, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let availability = [];

    for (let dt = new Date(start); dt < end; dt.setDate(dt.getDate() + 1)) {
        const inventory = await RoomInventory.findOne({
            roomType: roomTypeId,
            date: new Date(dt.setHours(0,0,0,0))
        });
        availability.push({
            date: new Date(dt).toISOString().split('T')[0],
            available: inventory ? inventory.availableRooms : 0
        });
    }

    return availability;
}

export async function checkParkAvailability(parkProductId, date) {
    const inventory = await ParkInventory.findOne({
        parkProduct: parkProductId,
        date: new Date(new Date(date).setHours(0,0,0,0))
    });

    return { availableTickets: inventory ? inventory.availableTickets : 0 };
}
