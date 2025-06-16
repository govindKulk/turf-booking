
import { useQuery } from '@tanstack/react-query';
import { getUserBookings } from '@/lib/api';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: getUserBookings,
  });
};
