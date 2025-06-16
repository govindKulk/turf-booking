
import { useQuery } from '@tanstack/react-query';
import { getSlots } from '@/lib/api';

export const useSlots = (turfId: number, date: string) => {
  return useQuery({
    queryKey: ['slots', turfId, date],
    queryFn: () => getSlots(turfId, date),
    enabled: !!turfId && !!date,
  });
};
