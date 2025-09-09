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

function RoomInventoryPage() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [inventories, setInventories] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchRoomTypes = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/admin/room-types', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch room types');
      const data = await response.json();
      setRoomTypes(data.data);
    } catch (err) {
      toast.error(err.message);
    }
  }, [token]);

  const fetchInventoryForDate = useCallback(async (date) => {
    if (!token) return;
    try {
      setLoading(true);
      const dateString = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/admin/room-inventory?date=${dateString}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      const invMap = {};
      data.data.forEach(inv => {
        invMap[inv.roomType._id] = { totalRooms: inv.totalRooms, availableRooms: inv.availableRooms };
      });
      setInventories(invMap);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  useEffect(() => {
    fetchInventoryForDate(selectedDate);
  }, [selectedDate, fetchInventoryForDate]);

  const handleInventoryChange = (roomTypeId, field, value) => {
      const newInventories = { ...inventories };
      if (!newInventories[roomTypeId]) {
          newInventories[roomTypeId] = { totalRooms: 0, availableRooms: 0 };
      }
      newInventories[roomTypeId][field] = value;
      setInventories(newInventories);
  }

  const handleUpdateInventory = async (roomTypeId) => {
      const inventory = inventories[roomTypeId];
      if (!inventory) return;
      try {
          const response = await fetch('/api/admin/room-inventory', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({
                  roomTypeId,
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
      <h1 className="text-2xl font-bold mb-4">Manage Room Inventory</h1>
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
              ) : roomTypes.map(rt => (
                <div key={rt._id} className="flex items-center justify-between p-2 border rounded-md">
                  <p className="font-medium">{rt.name}</p>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <Label>Total</Label>
                        <Input
                            type="number"
                            className="w-20"
                            value={inventories[rt._id]?.totalRooms || 0}
                            onChange={(e) => handleInventoryChange(rt._id, 'totalRooms', parseInt(e.target.value))}
                        />
                     </div>
                      <div className="flex items-center gap-2">
                        <Label>Available</Label>
                        <Input
                            type="number"
                            className="w-20"
                            value={inventories[rt._id]?.availableRooms || 0}
                            onChange={(e) => handleInventoryChange(rt._id, 'availableRooms', parseInt(e.target.value))}
                        />
                     </div>
                    <Button size="sm" onClick={() => handleUpdateInventory(rt._id)}>Update</Button>
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

export default withAdminAuth(RoomInventoryPage);
