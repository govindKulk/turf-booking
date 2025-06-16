
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useTurfById } from '@/hooks/useTurfById';
import { useSlots } from '@/hooks/useSlots';
import { useBookSlot } from '@/hooks/useBookSlot';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { Slot, BookingRequest } from '@/types';

const BookingCalendar = () => {
  const { turfId } = useParams<{ turfId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const id = turfId ? parseInt(turfId) : 0;
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('');

  const { data: turf, isLoading: isTurfLoading } = useTurfById(id);
  const { data: slots, isLoading: isSlotsLoading } = useSlots(id, format(selectedDate, 'yyyy-MM-dd'));
  const bookSlotMutation = useBookSlot();

  const handleBooking = async () => {
    if (!selectedSlot || !turf || !user) return;

    const bookingData: BookingRequest = {
      turfId: turf.id,
      slotId: selectedSlot.slotId,
      bookingDate: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      totalPrice: selectedSlot.price,
      notes: notes || undefined,
    };

    try {
      await bookSlotMutation.mutateAsync(bookingData);
      navigate('/my-bookings');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (isTurfLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!turf) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Turf not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book {turf.name}</h1>
        <p className="text-gray-600">{turf.location}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setSelectedSlot(null); // Reset selected slot when date changes
                }
              }}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Slot Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Available Slots for {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isSlotsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : slots && slots.length > 0 ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {slots.map((slot) => (
                  <button
                    key={slot.slotId}
                    onClick={() => setSelectedSlot(slot)}
                    disabled={!slot.isAvailable}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      selectedSlot?.slotId === slot.slotId
                        ? 'border-primary bg-primary/5'
                        : slot.isAvailable
                        ? 'border-gray-200 hover:border-gray-300'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-sm text-gray-500">
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">${slot.price}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No slots available for this date
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Form */}
      {selectedSlot && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-sm font-medium text-gray-600">Date</Label>
                <p className="font-semibold">{format(selectedDate, 'MMMM d, yyyy')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Time</Label>
                <p className="font-semibold">{selectedSlot.startTime} - {selectedSlot.endTime}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Total Price</Label>
                <p className="font-semibold text-primary">${selectedSlot.price}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special requirements or notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleBooking}
                disabled={bookSlotMutation.isPending}
                className="flex-1"
              >
                {bookSlotMutation.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/turfs/${turf.id}`)}
              >
                Back to Turf
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookingCalendar;
