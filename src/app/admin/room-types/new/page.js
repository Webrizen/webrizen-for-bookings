'use client';

import { RoomTypeForm } from "@/components/admin/RoomTypeForm";
import withAdminAuth from "@/components/auth/withAdminAuth";

function NewRoomTypePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Room Type</h1>
      <RoomTypeForm />
    </div>
  );
}

export default withAdminAuth(NewRoomTypePage);
