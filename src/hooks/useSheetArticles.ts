import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SheetArticle {
  title: string;
  topic: string;
  category: string;
  summary: string;
  imageUrl: string;
  date: string;
  isoDate: string | null;
  urn: string;
  url: string;
  posted: boolean;
}

interface State {
  articles: SheetArticle[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads the LinkedIn article index from the Google Sheet through the
 * `articles` edge function (the sheet's CSV export has no CORS headers).
 */
export const useSheetArticles = (): State & { reload: () => void } => {
  const [state, setState] = useState<State>({ articles: [], loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    supabase.functions
      .invoke("articles", { method: "GET" })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setState({ articles: [], loading: false, error: error.message });
          return;
        }
        const articles = (data as { articles?: SheetArticle[] } | null)?.articles ?? [];
        setState({ articles, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({
          articles: [],
          loading: false,
          error: err instanceof Error ? err.message : "Could not load articles",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { ...state, reload: () => setNonce((n) => n + 1) };
};
