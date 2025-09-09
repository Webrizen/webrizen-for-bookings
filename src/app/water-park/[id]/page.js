'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { toast, Toaster } from 'sonner';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WaterParkDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availability, setAvailability] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/water-park/${id}`);
        if (!response.ok) throw new Error('Failed to fetch product details');
        const data = await response.json();
        setProduct(data.data);
        // Initialize quantities
        const initialQuantities = {};
        data.data.prices.forEach(p => initialQuantities[p.ageGroup] = 0);
        setQuantities(initialQuantities);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!id || !selectedDate) return;
      try {
        setCheckingAvailability(true);
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?module=park&parkProductId=${id}&date=${dateString}`);
        if (!response.ok) throw new Error('Failed to check availability');
        const data = await response.json();
        setAvailability(data.data);
      } catch (err) {
        toast.error(err.message);
        setAvailability(null);
      } finally {
        setCheckingAvailability(false);
      }
    };
    checkAvailability();
  }, [id, selectedDate]);

  const handleAddToCart = async (ageGroup, price) => {
    const quantity = quantities[ageGroup];
    if (quantity <= 0) {
      toast.error('Please select a quantity.');
      return;
    }
     if (!token) {
        toast.error('Please login to add items to the cart.');
        return;
    }

    const item = {
      productType: 'ParkProduct',
      product: product._id,
      price: price,
      quantity: quantity,
      visitDate: selectedDate,
      ageGroup: ageGroup,
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
        toast.success(`${quantity} ${product.name} ticket(s) for ${ageGroup} added to cart!`);
    } catch (err) {
        toast.error(err.message);
    }
  };

  if (loading) return <div><Skeleton className="h-96 w-full" /></div>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
          <p className="mt-4">{product.description}</p>
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Book Tickets</CardTitle></CardHeader>
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
                <p>Available Tickets: {checkingAvailability ? '...' : (availability?.availableTickets ?? 'N/A')}</p>
              </div>

              {product.prices.map(p => (
                <div key={p.ageGroup} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{p.ageGroup}</p>
                        <p className="text-sm text-gray-500">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            min="0"
                            className="w-20"
                            value={quantities[p.ageGroup]}
                            onChange={(e) => setQuantities({...quantities, [p.ageGroup]: parseInt(e.target.value, 10)})}
                        />
                        <Button onClick={() => handleAddToCart(p.ageGroup, p.price)}>Add</Button>
                    </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
