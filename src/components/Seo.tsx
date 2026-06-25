import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://quantumailab.lovable.app";
const BRAND = "QuantumAI Lab";

interface SeoProps {
  title: string;
  description: string;
  /** Override canonical path; defaults to current route. */
  path?: string;
  /** JSON-LD object(s) to inject as <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Override og:type, defaults to "website". */
  ogType?: string;
  /** Optional og:image override. */
  image?: string;
}

const Seo = ({ title, description, path, jsonLd, ogType = "website", image }: SeoProps) => {
  const location = useLocation();
  const routePath = path ?? location.pathname ?? "/";
  const url = `${SITE_URL}${routePath === "/" ? "" : routePath}`;
  const fullTitle = title.includes(BRAND) ? title : `${title} — ${BRAND}`;
  const safeTitle = fullTitle.length > 60 ? fullTitle.slice(0, 57) + "…" : fullTitle;
  const safeDescription =
    description.length > 160 ? description.slice(0, 157) + "…" : description;

  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{safeTitle}</title>
      <meta name="description" content={safeDescription} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={safeTitle} />
      <meta property="og:description" content={safeDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:title" content={safeTitle} />
      <meta name="twitter:description" content={safeDescription} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}
      {ldArray.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
