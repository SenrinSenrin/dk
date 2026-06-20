import { useState, useEffect, useCallback } from "react";

// A global event emitter to handle cache invalidation
type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();

function subscribe(key: string, listener: Listener) {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(listener);
  return () => {
    listeners.get(key)!.delete(listener);
  };
}

function invalidate(queryKey: any[]) {
  const targetPrefix = JSON.stringify(queryKey);
  // Simple prefix-based invalidation (e.g., ["admin", "videos"] matches ["admin", "videos", "detail"])
  for (const [k, set] of listeners.entries()) {
    try {
      const parsedKey = JSON.parse(k);
      if (Array.isArray(parsedKey) && queryKey.every((val, i) => parsedKey[i] === val)) {
        set.forEach((l) => l());
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
}

export function useQueryClient() {
  return {
    invalidateQueries: ({ queryKey }: { queryKey: any[] }) => {
      invalidate(queryKey);
    },
  };
}

export function useQuery<T>({
  queryKey,
  queryFn,
}: {
  queryKey: any[];
  queryFn: () => Promise<T>;
}) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await queryFn();
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(queryKey)]); // ignoring queryFn for dependency array since they are often inline

  useEffect(() => {
    fetch();
    const unsubscribe = subscribe(JSON.stringify(queryKey), fetch);
    return unsubscribe;
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

export function useMutation<TVariables = void, TData = void, TError = Error>({
  mutationFn,
  onSuccess,
  onError,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const mutate = async (variables?: TVariables) => {
    setIsPending(true);
    try {
      const data = await mutationFn(variables as TVariables);
      onSuccess?.(data, variables as TVariables);
      return data;
    } catch (error: any) {
      onError?.(error, variables as TVariables);
      // Suppress unhandled promise rejections if there is no onError handler
      // or if it was thrown internally, similar to React Query's default behavior
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
}
