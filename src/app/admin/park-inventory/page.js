'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import withAdminAuth from '@/components/auth/withAdminAuth';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from 'sonner';
import { format } from 'date-fns';

function ParkInventoryPage() {
  const [products, setProducts] = useState([]);
  const [inventories, setInventories] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/park-products', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch park products');
      const data = await response.json();
      setProducts(data.data);
    } catch (err) {
      toast.error(err.message);
    }
  }, [token]);

  const fetchInventoryForDate = useCallback(async (date) => {
    if (!token) return;
    try {
      setLoading(true);
      const dateString = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/admin/park-inventory?date=${dateString}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      const invMap = {};
      data.data.forEach(inv => {
        invMap[inv.parkProduct._id] = { totalTickets: inv.totalTickets, availableTickets: inv.availableTickets };
      });
      setInventories(invMap);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchInventoryForDate(selectedDate);
  }, [selectedDate, fetchInventoryForDate]);

  const handleInventoryChange = (productId, field, value) => {
      const newInventories = { ...inventories };
      if (!newInventories[productId]) {
          newInventories[productId] = { totalTickets: 0, availableTickets: 0 };
      }
      newInventories[productId][field] = value;
      setInventories(newInventories);
  }

  const handleUpdateInventory = async (productId) => {
      const inventory = inventories[productId];
      if (!inventory) return;
      try {
          const response = await fetch('/api/admin/park-inventory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                  parkProductId: productId,
                  date: format(selectedDate, 'yyyy-MM-dd'),
                  ...inventory
              })
          });
          if (!response.ok) throw new Error('Failed to update inventory');
          toast.success('Inventory updated successfully!');
      } catch(err) {
          toast.error(err.message);
      }
  }

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Manage Park Ticket Inventory</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader><CardTitle>Inventory for {format(selectedDate, 'PPP')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                 [...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
              ) : products.map(p => (
                <div key={p._id} className="flex items-center justify-between p-2 border rounded-md">
                  <p className="font-medium">{p.name}</p>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <Label>Total</Label>
                        <Input
                            type="number"
                            className="w-20"
                            value={inventories[p._id]?.totalTickets || 0}
                            onChange={(e) => handleInventoryChange(p._id, 'totalTickets', parseInt(e.target.value))}
                        />
                     </div>
                      <div className="flex items-center gap-2">
                        <Label>Available</Label>
                        <Input
                            type="number"
                            className="w-20"
                            value={inventories[p._id]?.availableTickets || 0}
                            onChange={(e) => handleInventoryChange(p._id, 'availableTickets', parseInt(e.target.value))}
                        />
                     </div>
                    <Button size="sm" onClick={() => handleUpdateInventory(p._id)}>Update</Button>
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

export default withAdminAuth(ParkInventoryPage);
