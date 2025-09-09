'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CouponForm } from '@/components/admin/CouponForm';
import withAdminAuth from '@/components/auth/withAdminAuth';

function EditCouponPage() {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchCoupon = async () => {
      if (!id || !token) return;
      try {
        const response = await fetch(`/api/admin/coupons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch coupon');
        }
        const data = await response.json();
        setCoupon(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, [token, id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Coupon</h1>
      {coupon ? <CouponForm coupon={coupon} /> : <div>Coupon not found</div>}
    </div>
  );
}

export default withAdminAuth(EditCouponPage);
