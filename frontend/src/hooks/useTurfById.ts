
import { useQuery } from '@tanstack/react-query';
import { getTurfById } from '@/lib/api';

export const useTurfById = (id: number) => {
  return useQuery({
    queryKey: ['turf', id],
    queryFn: () => getTurfById(id),
    enabled: !!id,
  });
};
