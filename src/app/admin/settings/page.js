'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import withAdminAuth from '@/components/auth/withAdminAuth';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner';

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchSettings = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();

      // Transform the settings array into an object for easier access
      const settingsObj = data.data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      setSettings(settingsObj);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  if (loading) {
    return <div><Skeleton className="h-48 w-full" /></div>;
  }

  return (
    <div>
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Application Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}

export default withAdminAuth(SettingsPage);
