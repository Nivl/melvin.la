import { useEffect, useState } from 'react';

export function useWindow() {
  const [data, setData] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setData(true);
    }
  }, []);

  return [data, setData];
}
