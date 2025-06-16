
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTurf, updateTurf } from '@/lib/api';
import { CreateTurfRequest, UpdateTurfRequest } from '@/types';
import { toast } from 'sonner';

export const useCreateTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (turfData: CreateTurfRequest) => createTurf(turfData),
    onSuccess: () => {
      toast.success('Turf created successfully!');
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create turf.');
    },
  });
};

export const useUpdateTurf = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, turfData }: { id: number; turfData: UpdateTurfRequest }) => updateTurf(id, turfData),
    onSuccess: (_, variables) => {
      toast.success('Turf updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['turfs'] });
      queryClient.invalidateQueries({ queryKey: ['turf', variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update turf.');
    },
  });
};
