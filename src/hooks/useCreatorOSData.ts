import { useEffect, useState } from "react";
import type { CreatorOSData } from "../integrations/supabase/creatoros";
import { loadCreatorOSData } from "../integrations/supabase/creatoros";

export function useCreatorOSData(userId?: string) {
  const [data, setData] = useState<CreatorOSData | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const result = await loadCreatorOSData(userId);
    setData(result);
    setLoading(false);
    return result;
  }

  useEffect(() => {
    let mounted = true;

    loadCreatorOSData(userId)
      .then((result) => {
        if (mounted) setData(result);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  return { data, loading, refresh };
}
