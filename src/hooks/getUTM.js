// hooks/useUTM.ts
import { useEffect, useState } from "react";


export function useUTM() {
  const [utm, setUtm] = useState({
    utm_source: "organic",
    utm_medium: "organic",
    utm_campaign: "organic",
    utm_content: "organic",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    setUtm({
      utm_source: params.get("utm_source") || "organic",
      utm_medium: params.get("utm_medium") || "organic",
      utm_campaign: params.get("utm_campaign") || "organic",
      utm_content: params.get("utm_content") || "organic",
    });
  }, []);
  console.log(utm);
  return utm;
}
