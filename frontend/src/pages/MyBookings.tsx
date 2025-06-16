
import React, { useState } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays, Clock, MapPin, Receipt, TriangleAlert } from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';

const BookingCard = ({ booking }: { booking: Booking }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{booking.turfName}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">#{booking.bookingReference}</p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {booking.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{format(new Date(booking.bookingDate), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{booking.startTime} - {booking.endTime}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <div className="font-semibold text-primary">${booking.totalPrice}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Receipt className="w-4 h-4 mr-1" />
              Receipt
            </Button>
            {booking.status === 'UPCOMING' && (
              <Button size="sm" variant="destructive">
                Cancel
              </Button>
            )}
          </div>
        </div>
        
        {booking.notes && (
          <div className="pt-2 border-t">
            <p className="text-sm text-gray-600">
              <strong>Notes:</strong> {booking.notes}
            </p>
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          Booked on {format(new Date(booking.createdAt), 'MMM d, yyyy')}
        </div>
      </CardContent>
    </Card>
  );
};

const MyBookings = () => {
  const { data: bookings, isLoading, isError, error } = useBookings();
  const [activeTab, setActiveTab] = useState('all');

  const filterBookings = (status?: string) => {
    if (!bookings) return [];
    if (status === 'all' || !status) return bookings;
    return bookings.filter(booking => booking.status.toLowerCase() === status);
  };

  const renderSkeletons = () => (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        {renderSkeletons()}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <Alert variant="destructive">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error loading bookings</AlertTitle>
          <AlertDescription>
            {(error as any)?.message || "Failed to load your bookings. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const upcomingBookings = filterBookings('upcoming');
  const completedBookings = filterBookings('completed');
  const cancelledBookings = filterBookings('cancelled');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button asChild>
          <a href="/turfs">Book New Turf</a>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({bookings?.length || 0})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {bookings && bookings.length > 0 ? (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800">No bookings found</h2>
              <p className="mt-2 text-gray-500">You haven't made any bookings yet.</p>
              <Button asChild className="mt-4">
                <a href="/turfs">Book Your First Turf</a>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800">No upcoming bookings</h2>
              <p className="mt-2 text-gray-500">Book a turf to see your upcoming reservations here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length > 0 ? (
            <div className="grid gap-4">
              {completedBookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800">No completed bookings</h2>
              <p className="mt-2 text-gray-500">Your completed bookings will appear here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length > 0 ? (
            <div className="grid gap-4">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.bookingId} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800">No cancelled bookings</h2>
              <p className="mt-2 text-gray-500">Your cancelled bookings will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;
