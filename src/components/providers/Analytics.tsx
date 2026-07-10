import Script from "next/script";

/**
 * Privacy-friendly analytics stub behind an env flag (§289).
 * Set NEXT_PUBLIC_ANALYTICS_ID to your Plausible domain (e.g. "sayan.dev")
 * to activate; absent = zero analytics code shipped.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_ANALYTICS_ID;
  if (!domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
