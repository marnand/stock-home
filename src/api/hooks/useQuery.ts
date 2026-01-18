/**
 * Hook customizado para requisições GET com cache
 * Integra-se com React Query para melhor performance
 */

import { useQuery as useReactQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiError } from '../errors/ApiError';

interface UseQueryConfig<T> extends Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'> {
  enabled?: boolean;
}

export function useQuery<T>(
  queryKey: (string | number | unknown)[] | string,
  queryFn: () => Promise<T>,
  config?: UseQueryConfig<T>
) {
  const key = Array.isArray(queryKey) ? queryKey : [queryKey];

  return useReactQuery<T, Error>({
    queryKey: key,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (era cacheTime)
    retry: (failureCount, error) => {
      // Não fazer retry para erros de validação ou autenticação
      if (error instanceof ApiError) {
        return !error.isClientError() && failureCount < 3;
      }
      return failureCount < 3;
    },
    ...config,
  });
}
