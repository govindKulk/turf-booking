
import { useQuery } from '@tanstack/react-query';
import { getTurfs } from '@/lib/api';

export const useTurfs = () => {
  return useQuery({
    queryKey: ['turfs'],
    queryFn: getTurfs,
  });
};
