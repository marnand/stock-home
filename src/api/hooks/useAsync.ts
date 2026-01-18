/**
 * Hook customizado para gerenciar estados assincronos
 * Implementa padrão de estado com loading, error e data
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
  options?: UseAsyncOptions<T>
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: options?.initialData ?? null,
    loading: false,
    error: null,
  });

  const isMountedRef = useRef(true);
  const asyncFunctionRef = useRef(asyncFunction);
  const optionsRef = useRef(options);
  const hasExecutedRef = useRef(false);

  // Atualiza as refs quando as props mudam
  asyncFunctionRef.current = asyncFunction;
  optionsRef.current = options;

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await asyncFunctionRef.current();

      if (isMountedRef.current) {
        setState({ data: response, loading: false, error: null });
        optionsRef.current?.onSuccess?.(response);
      }

      return response;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (isMountedRef.current) {
        setState((prev) => ({ ...prev, error: err, loading: false }));
        optionsRef.current?.onError?.(err);
      }

      throw err;
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    if (immediate && !hasExecutedRef.current) {
      hasExecutedRef.current = true;
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [immediate, execute]);

  return { ...state, execute };
}
