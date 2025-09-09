'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';

export default function VenueDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/venues/${id}`);
        if (!response.ok) throw new Error('Failed to fetch venue details');
        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVenue();
  }, [id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!venue || !selectedDate) return;
      try {
        setCheckingAvailability(true);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?module=venue&venueId=${id}&date=${dateString}`);
        if (!response.ok) throw new Error('Failed to check availability');
        const data = await response.json();
        setAvailableSlots(data.data.availableSlots || []);
        setSelectedSlot('');
      } catch (err) {
        toast.error(err.message);
        setAvailableSlots([]);
      } finally {
        setCheckingAvailability(false);
      }
    };
    checkAvailability();
  }, [id, venue, selectedDate]);

  const handleAddToCart = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot.');
      return;
    }
    if (!token) {
        toast.error('Please login to add items to the cart.');
        // You might want to redirect to login page here
        return;
    }

    const item = {
      productType: 'Venue',
      product: venue._id,
      price: venue.basePrice, // This should be calculated based on slot, etc.
      eventDate: selectedDate,
      slot: {
          startTime: selectedSlot.split('-')[0],
          endTime: selectedSlot.split('-')[1]
      }
    };

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add to cart');
        }
        toast.success('Venue added to cart!');
    } catch (err) {
        toast.error(err.message);
    }
  };

  if (loading) return <div><Skeleton className="h-96 w-full" /><Skeleton className="h-8 w-1/4 mt-4" /></div>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!venue) return <p>Venue not found.</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={venue.images?.[0] || '/placeholder.svg'} alt={venue.name} className="w-full h-96 object-cover rounded-lg" />
          <h1 className="text-3xl font-bold mt-4">{venue.name}</h1>
          <p className="text-lg text-gray-500">{venue.city}, {venue.state}</p>
          <p className="mt-4">{venue.description}</p>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Book Now</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
              </div>
              <div>
                <Label>Select Slot</Label>
                <Select onValueChange={setSelectedSlot} value={selectedSlot}>
                  <SelectTrigger disabled={checkingAvailability}>
                    <SelectValue placeholder={checkingAvailability ? "Checking..." : "Select a time slot"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.length > 0 ? (
                      availableSlots.map(slot => (
                        <SelectItem key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime}-${slot.endTime}`}>
                          {`${slot.startTime} - ${slot.endTime}`}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-slots" disabled>No available slots for this date</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-2xl font-bold">
                ₹{venue.basePrice.toLocaleString('en-IN')}
              </div>
              <Button onClick={handleAddToCart} className="w-full" disabled={!selectedSlot}>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
