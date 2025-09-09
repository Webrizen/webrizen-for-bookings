'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import withAdminAuth from '@/components/auth/withAdminAuth';

function TestPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTest = async () => {
      if (!token) return;
      try {
        const response = await fetch('/api/admin/test', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setMessage(data.message);
        } else {
          setMessage(`Error: ${data.error || 'Failed to fetch'}`);
        }
      } catch (err) {
        setMessage(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTest();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Test Page</h1>
      {loading ? <p>Loading...</p> : <p>API Response: {message}</p>}
    </div>
  );
}

export default withAdminAuth(TestPage);
