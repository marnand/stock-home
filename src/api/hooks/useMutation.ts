/**
 * Hook customizado para requisições que modificam dados (POST, PUT, DELETE)
 * Integra-se com React Query para sincronização automática de cache
 */

import { useMutation as useReactMutation, UseMutationOptions } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

interface UseMutationConfig<T, V = void>
  extends Omit<UseMutationOptions<T, Error, V, unknown>, 'mutationFn'> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  invalidateQueries?: string[];
}

export function useMutation<T, V = void>(
  mutationFn: (variables: V) => Promise<T>,
  config?: UseMutationConfig<T, V>
) {
  return useReactMutation<T, Error, V>({
    mutationFn,
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      if (config?.invalidateQueries) {
        config.invalidateQueries.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }

      config?.onSuccess?.(data);
    },
    onError: (error) => {
      config?.onError?.(error);
    },
  });
}
