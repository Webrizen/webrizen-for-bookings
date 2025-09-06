'use client';

import withAdminAuth from '@/components/auth/withAdminAuth';

function AdminDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard! This is a protected area.</p>
    </div>
  );
}

export default withAdminAuth(AdminDashboard);
