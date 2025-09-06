'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAdminAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { user, token, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) {
        return; // Wait for loading to complete
      }

      if (!token || !user) {
        router.replace('/login');
        return;
      }

      if (user.role !== 'admin') {
        logout();
        router.replace('/login');
      }

    }, [user, token, loading, router, logout]);

    if (loading || !user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      );
    }

    if (user.role === 'admin') {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  Wrapper.displayName = `withAdminAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Wrapper;
};

export default withAdminAuth;
