import { SITE_NAME } from "@/lib/constants";
import { locationLabel, priceRange, shortServiceName } from "@/lib/content";
import { getLocalePhone, type AppLocale } from "@/lib/i18n";
import type { DirectoryPageData, ZipCode } from "@/lib/types";
import type { PageVariation } from "@/lib/variation/types";

export function toGeoCoordinates(
  zip: Pick<ZipCode, "latitude" | "longitude"> | null | undefined,
) {
  const latitude = zip?.latitude;
  const longitude = zip?.longitude;

  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return undefined;
  }

  return {
    "@type": "GeoCoordinates" as const,
    latitude,
    longitude,
  };
}

function toPriceSpecification(minPrice: number, maxPrice: number) {
  return {
    "@type": "PriceSpecification" as const,
    priceCurrency: "USD",
    minPrice,
    maxPrice,
  };
}

function parseUsdRange(price: string) {
  const amounts = [...price.matchAll(/\$(\d+)/g)].map((match) =>
    Number.parseInt(match[1], 10),
  );
  const minPrice = amounts[0];
  const maxPrice = amounts[1] ?? amounts[0];

  if (
    minPrice == null ||
    maxPrice == null ||
    !Number.isFinite(minPrice) ||
    !Number.isFinite(maxPrice)
  ) {
    return undefined;
  }

  return toPriceSpecification(minPrice, maxPrice);
}

export function serializeJsonLd(json: unknown) {
  return JSON.stringify(json).replace(/</g, "\\u003c");
}

export function buildEmergencyServiceSchema(
  data: DirectoryPageData,
  variation: PageVariation,
  pageUrl: string,
  locale: AppLocale = "en",
) {
  const shortName = shortServiceName(data.service);
  const geo = toGeoCoordinates(data.zip);
  const phone = getLocalePhone(locale);
  const address = {
    "@type": "PostalAddress" as const,
    addressLocality: data.zip.city,
    addressRegion: data.zip.state_id,
    postalCode: data.zip.zip_code,
    addressCountry: "US",
  };

  return {
    "@context": "https://schema.org",
    "@type": ["EmergencyService", "Locksmith"],
    name: `${SITE_NAME} 24/7 Emergency ${shortName}`,
    description: variation.metaDescription,
    url: pageUrl,
    telephone: phone.e164,
    priceRange: priceRange(data.service),
    areaServed: address,
    address,
    ...(geo ? { geo } : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    offers: {
      "@type": "Offer",
      url: pageUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      priceSpecification: toPriceSpecification(
        data.service.avg_price_min,
        data.service.avg_price_max,
      ),
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${shortName} cost ranges in ${locationLabel(data.zip)}`,
      itemListElement: variation.jobEstimates.map((job) => {
        const priceSpecification = parseUsdRange(job.price);
        return {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: job.job,
          },
          description: `${job.note}. Dispatch ${job.time}.`,
          ...(priceSpecification ? { priceSpecification } : {}),
        };
      }),
    },
  };
}

export function buildFaqSchema(variation: PageVariation) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: variation.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
