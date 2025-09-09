'use client';

import { ParkProductForm } from "@/components/admin/ParkProductForm";
import withAdminAuth from "@/components/auth/withAdminAuth";

function NewParkProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Park Product</h1>
      <ParkProductForm />
    </div>
  );
}

export default withAdminAuth(NewParkProductPage);
