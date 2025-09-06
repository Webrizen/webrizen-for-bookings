'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { RoomTypeForm } from '@/components/admin/RoomTypeForm';
import withAdminAuth from '@/components/auth/withAdminAuth';

function EditRoomTypePage() {
  const { id } = useParams();
  const [roomType, setRoomType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRoomType = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`/api/admin/room-types/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch room type');
        }
        const data = await response.json();
        setRoomType(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomType();
  }, [token, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Room Type</h1>
      {roomType ? <RoomTypeForm roomType={roomType} /> : <div>Room Type not found</div>}
    </div>
  );
}

export default withAdminAuth(EditRoomTypePage);
