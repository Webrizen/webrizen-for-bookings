'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ParkProductForm } from '@/components/admin/ParkProductForm';
import withAdminAuth from '@/components/auth/withAdminAuth';

function EditParkProductPage() {
  const { id } = useParams();
  const [parkProduct, setParkProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchParkProduct = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`/api/admin/park-products/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch park product');
        }
        const data = await response.json();
        setParkProduct(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParkProduct();
  }, [token, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Park Product</h1>
      {parkProduct ? <ParkProductForm parkProduct={parkProduct} /> : <div>Park Product not found</div>}
    </div>
  );
}

export default withAdminAuth(EditParkProductPage);
