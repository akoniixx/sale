import { useEffect, useState } from 'react';

export const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setLoading(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, loading];
};
