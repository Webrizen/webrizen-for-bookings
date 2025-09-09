'use client';

import { CouponForm } from "@/components/admin/CouponForm";
import withAdminAuth from "@/components/auth/withAdminAuth";

function NewCouponPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Coupon</h1>
      <CouponForm />
    </div>
  );
}

export default withAdminAuth(NewCouponPage);
