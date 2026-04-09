import { useEffect } from "react";

const BASE = "Quantum AI Lab";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Where Intelligence Meets Infinity`;
  }, [title]);
}
