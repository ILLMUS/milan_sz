
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSiteAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAdmin() {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("site_admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (active) {
        setIsAdmin(!error && !!data);
        setLoading(false);
      }
    }

    checkAdmin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
}
