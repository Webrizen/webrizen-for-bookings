'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/venues');
        if (!response.ok) {
          throw new Error('Failed to fetch venues');
        }
        const data = await response.json();
        setVenues(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Marriage Gardens</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : venues.length === 0 ? (
        <p>No venues available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {venues.map((venue) => (
            <Card key={venue._id}>
              <img src={venue.images?.[0] || '/placeholder.svg'} alt={venue.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{venue.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400">{venue.city}</p>
                <Button asChild className="mt-4 w-full">
                  <Link href={`/venues/${venue._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
