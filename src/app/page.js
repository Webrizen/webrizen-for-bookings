import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center shadow-sm">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-xl font-bold">Booking App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/venues"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Venues
          </Link>
          <Link
            href="/hotels"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Hotels
          </Link>
          <Link
            href="/water-park"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Water Park
          </Link>
          <Button asChild variant="outline">
            <Link
              href="/login"
            >
              Admin Login
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Unified Booking for Every Occasion
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  From marriage gardens to hotel rooms and water park tickets, find and book everything you need in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link
                    href="#services"
                  >
                    Explore Services
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="services" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We offer a wide range of booking services to meet your needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CardTitle>Marriage Gardens</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">Book beautiful gardens for your special day.</p>
                  <Button asChild className="mt-4">
                    <Link href="/venues">Browse Gardens</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Hotels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">Find and book hotel rooms with ease.</p>
                   <Button asChild className="mt-4">
                    <Link href="/hotels">Browse Hotels</Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Water Park</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">Get your tickets for a fun day at the water park.</p>
                   <Button asChild className="mt-4">
                    <Link href="/water-park">Book Tickets</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 Booking App. All rights reserved.</p>
      </footer>
    </div>
  );
}
