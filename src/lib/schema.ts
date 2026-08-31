import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { locationLabel, priceRange, shortServiceName } from "@/lib/content";
import { getDictionary, getLocalePhone, type AppLocale } from "@/lib/i18n";
import {
  countyDisplayName,
  countyPath,
  directoryPath,
  hasCountyName,
  localeHomePath,
} from "@/lib/paths";
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

export function buildPageJsonLd(
  data: DirectoryPageData,
  variation: PageVariation,
  pageUrl: string,
  locale: AppLocale = "en",
) {
  const shortName = shortServiceName(data.service);
  const geo = toGeoCoordinates(data.zip);
  const phone = getLocalePhone(locale, data.service);
  const address = {
    "@type": "PostalAddress" as const,
    addressLocality: data.zip.city,
    addressRegion: data.zip.state_id,
    postalCode: data.zip.zip_code,
    addressCountry: "US",
  };

  const pricingFaqs = variation.jobEstimates.map((job) => ({
    "@type": "Question",
    name:
      locale === "es"
        ? `¿Cuánto cuesta ${job.job} en ${data.zip.city}, ${data.zip.state_id} ${data.zip.zip_code}?`
        : `What does ${job.job} cost in ${data.zip.city}, ${data.zip.state_id} ${data.zip.zip_code}?`,
    acceptedAnswer: {
      "@type": "Answer",
      text:
        locale === "es"
          ? `El costo típico de ${job.job.toLowerCase()} en ${data.zip.zip_code} es ${job.price}. El tiempo de despacho es unos ${job.time}. ${job.note}`
          : `Typical ${job.job.toLowerCase()} cost in ${data.zip.zip_code} is ${job.price}. Dispatch time is about ${job.time}. ${job.note}`,
    },
  }));

  const contentFaqs = variation.faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const copy = getDictionary(locale);
  const cityUrl = `${SITE_URL}${directoryPath({
    locale,
    service: data.service.slug,
    state: data.zip.state_id,
    city: data.zip.city,
  })}`;
  const crumbItems = [
    {
      "@type": "ListItem" as const,
      position: 1,
      name: copy.breadcrumbHome,
      item: `${SITE_URL}${localeHomePath(locale)}`,
    },
  ];

  if (hasCountyName(data.zip.county_name)) {
    crumbItems.push({
      "@type": "ListItem" as const,
      position: crumbItems.length + 1,
      name: countyDisplayName(data.zip.county_name),
      item: `${SITE_URL}${countyPath({
        locale,
        service: data.service.slug,
        state: data.zip.state_id,
        county: data.zip.county_name,
      })}`,
    });
  }

  crumbItems.push(
    {
      "@type": "ListItem" as const,
      position: crumbItems.length + 1,
      name: data.zip.city,
      item: cityUrl,
    },
    {
      "@type": "ListItem" as const,
      position: crumbItems.length + 2,
      name: data.zip.zip_code,
      item: pageUrl,
    },
  );

  const breadcrumb = {
    "@type": "BreadcrumbList" as const,
    itemListElement: crumbItems,
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb,
      {
        "@type": "EmergencyService",
        name: `${SITE_NAME} 24/7 Emergency ${shortName}`,
        description: variation.metaDescription,
        url: pageUrl,
        telephone: phone.schemaTelephone,
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
      },
      {
        "@type": "FAQPage",
        mainEntity: [...pricingFaqs, ...contentFaqs],
      },
    ],
  };
}
