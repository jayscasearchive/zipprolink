import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { locationLabel, shortServiceName } from "@/lib/content";
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
  const phone = getLocalePhone(locale, data.service);
  const areaServed = {
    "@type": "PostalCode" as const,
    postalCode: data.zip.zip_code,
    addressLocality: data.zip.city,
    addressRegion: data.zip.state_id,
    addressCountry: "US",
  };
  const orgId = `${SITE_URL}/#organization`;

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

  const referralDescription =
    locale === "es"
      ? `${SITE_NAME} es un servicio de referidos. Esta página cubre el código postal ${data.zip.zip_code} en ${data.zip.city}, ${data.zip.state_id}. No es la dirección de un taller.`
      : `${SITE_NAME} is a referral matching service. This page covers ZIP ${data.zip.zip_code} in ${data.zip.city}, ${data.zip.state_id}. It is not a shop address.`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumb,
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_URL,
        telephone: phone.schemaTelephone,
        description: referralDescription,
      },
      {
        "@type": "Service",
        name: `${shortName} referral in ${locationLabel(data.zip)}`,
        serviceType: `Emergency ${shortName} referral`,
        description: variation.metaDescription,
        url: pageUrl,
        provider: { "@id": orgId },
        areaServed,
        offers: {
          "@type": "Offer",
          url: pageUrl,
          category: "Referral",
          priceCurrency: "USD",
          priceSpecification: toPriceSpecification(
            data.service.avg_price_min,
            data.service.avg_price_max,
          ),
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Illustrative ${shortName} ranges for ${locationLabel(data.zip)}`,
          itemListElement: variation.jobEstimates.map((job) => {
            const priceSpecification = parseUsdRange(job.price);
            return {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: job.job,
              },
              description: `${job.note}. Typical dispatch window ${job.time}.`,
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
