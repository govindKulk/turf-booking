
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookSlot } from '@/lib/api';
import { BookingRequest } from '@/types';
import { toast } from '@/components/ui/sonner';

export const useBookSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: BookingRequest) => bookSlot(bookingData),
    onSuccess: (data) => {
      toast.success(`Booking confirmed! Reference: ${data.bookingReference}`);
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to book slot');
    },
  });
};
