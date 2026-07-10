import { education, owner, site } from "@/content/data";

/** JSON-LD Person schema — current role, employer, socials (§258, §108). */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: owner.name,
    jobTitle: "Product Analyst (ISG)",
    description: owner.summary,
    email: `mailto:${owner.email}`,
    telephone: owner.phone,
    url: site.url,
    image: `${site.url}/media/og-image.jpg`,
    sameAs: [owner.linkedin, owner.github],
    worksFor: {
      "@type": "Organization",
      name: "Cognizant",
      url: "https://www.cognizant.com",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressCountry: "IN",
    },
    knowsAbout: ["COBOL", "CICS", "DB2", "JCL", "z/OS", "IBM watsonx.ai", "Python"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
