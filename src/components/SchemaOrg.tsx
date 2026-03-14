/**
 * Injects a JSON-LD SoftwareApplication schema into the page <head>.
 * Tells Google this is a free web app — eligible for rich results
 * (star ratings, pricing badge, etc.) in search.
 */
export function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BookVra",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Free scheduling tool for solo professionals. Set your availability, let clients book in seconds. No back-and-forth, no missed bookings.",
    url: "https://www.bookvra.com",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Online appointment booking",
      "Public booking page",
      "Instant email confirmations",
      "Weekly schedule templates",
      "Multi-language support (English, Swedish)",
    ],
    inLanguage: ["en", "sv"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
