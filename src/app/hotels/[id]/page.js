'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'sonner';
import { format, addDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

export default function HotelDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [availability, setAvailability] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hotels/${id}`);
        if (!response.ok) throw new Error('Failed to fetch room type details');
        const data = await response.json();
        setRoomType(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoomType();
  }, [id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!id || !dateRange?.from || !dateRange?.to) return;
      try {
        setCheckingAvailability(true);
        const from = format(dateRange.from, 'yyyy-MM-dd');
        const to = format(dateRange.to, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?module=room&roomTypeId=${id}&startDate=${from}&endDate=${to}`);
        if (!response.ok) throw new Error('Failed to check availability');
        const data = await response.json();
        setAvailability(data.data);
      } catch (err) {
        toast.error(err.message);
        setAvailability([]);
      } finally {
        setCheckingAvailability(false);
      }
    };
    checkAvailability();
  }, [id, dateRange]);

  const handleAddToCart = async () => {
    // ... Add to cart logic will be implemented later
    toast.info("Add to cart functionality to be implemented");
  };

  if (loading) return <div><Skeleton className="h-96 w-full" /></div>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!roomType) return <p>Room type not found.</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img src={roomType.images?.[0] || '/placeholder.svg'} alt={roomType.name} className="w-full h-96 object-cover rounded-lg" />
          <h1 className="text-3xl font-bold mt-4">{roomType.name}</h1>
          <p className="mt-4">{roomType.description}</p>
          <div className="mt-4">
            <h3 className="font-bold">Amenities:</h3>
            <ul className="list-disc list-inside">
              {roomType.amenities?.map(amenity => <li key={amenity}>{amenity}</li>)}
            </ul>
          </div>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Book Now</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Dates</Label>
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="rounded-md border"
                  numberOfMonths={2}
                  disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                />
              </div>
              <div className="text-2xl font-bold">
                ₹{roomType.price.toLocaleString('en-IN')} / night
              </div>
              <Button onClick={handleAddToCart} className="w-full">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
