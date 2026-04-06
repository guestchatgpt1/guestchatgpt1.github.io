import { useEffect } from "react";

const BASE = "QuantumNest AI";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE}` : `${BASE} — Where Intelligence Meets Infinity`;
  }, [title]);
}
