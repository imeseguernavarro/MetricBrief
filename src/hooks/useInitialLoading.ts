import { useEffect, useState } from "react";

export function useInitialLoading(delay = 650) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), delay);
    return () => window.clearTimeout(timeout);
  }, [delay]);

  return loading;
}
