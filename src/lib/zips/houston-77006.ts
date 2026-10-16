import type { AppLocale } from "@/lib/i18n";
import { citySlug, directoryPath } from "@/lib/paths";
import type { FaqItem } from "@/lib/types";
import type { DispatchStep, PageVariation } from "@/lib/variation/types";

export const HOUSTON_77006_ZIP = "77006";

export function isHouston77006Page(
  city: string,
  stateId: string,
  zipCode: string,
) {
  return (
    zipCode === HOUSTON_77006_ZIP &&
    stateId.toLowerCase() === "tx" &&
    citySlug(city) === "houston"
  );
}

export type Houston77006HubLink = {
  href: string;
  before: string;
  label: string;
  after: string;
};

type Houston77006Copy = {
  documentTitle: string;
  headline: string;
  metaDescription: string;
  heroSupport: string;
  densityCopy: string;
  asideTitle: string;
  asideBody: string;
  asideMetric: string;
  asideMetricLabel: string;
  asideDispatch: string;
  asideDispatchValue: string;
  chipPrimaryLabel: string;
  chipPrimaryValue: string;
  chipSecondaryLabel: string;
  chipSecondaryValue: string;
  introHeading: string;
  introParagraphs: string[];
  checklistHeading: string;
  checklist: string[];
  localHeading: string;
  localBody: string;
  dpsHeading: string;
  dpsBody: string;
  processHeading: string;
  processIntro: string;
  processSteps: DispatchStep[];
  pricingHeading: string;
  pricingIntro: string;
  faqHeading: string;
  faqLead: string;
  faqs: FaqItem[];
};

const EN: Houston77006Copy = {
  documentTitle: "Locksmith in Houston, TX 77006 — referral",
  headline: "Locked out in Houston 77006? Request a locksmith referral",
  metaDescription:
    "Locked out of a car or home in Houston ZIP 77006 (Montrose)? Call ZipProLink to request a referral to an independent locksmith. A match is attempted only if a provider is available.",
  heroSupport:
    "ZIP 77006 is the Montrose postal code in Houston. Call the number on this page to request a referral for a car or home lockout. ZipProLink is a matching service, not a locksmith shop. A technician is referred only if an independent provider can take the job.",
  densityCopy:
    "77006 sits in inner Houston. Streets here are mixed residential and small commercial. That can slow parking and building access. It does not change how the referral works: availability still depends on whether a provider can take the job.",
  asideTitle: "This ZIP",
  asideBody:
    "This listing is for Houston 77006. It is not a storefront on a Montrose street. Neighbor ZIP links below are nearby listings, not extra shops.",
  asideMetric: "77006",
  asideMetricLabel: "Montrose ZIP",
  asideDispatch: "Referral",
  asideDispatchValue: "Only if a provider is available",
  chipPrimaryLabel: "Request",
  chipPrimaryValue: "Call for a referral",
  chipSecondaryLabel: "Cost",
  chipSecondaryValue: "Quoted on site",
  introHeading: "Lock help in Houston 77006",
  introParagraphs: [
    "People land on this page after a lockout in Montrose or on the blocks of 77006 that run toward Midtown. The usual cases are keys left in a car, a dead battery in a fob, or a house or apartment door that will not open. ZipProLink does not send a branded van and does not employ the person who may arrive.",
    "When you call, say you are in Houston, give ZIP 77006, and say whether it is a vehicle or a residence. That is enough for intake. You are asking for a match with an independent locksmith, not booking ZipProLink as the company that will open the lock.",
    "A live person may answer, or you may hear a short menu. If a provider accepts, that technician confirms the work and the price with you before starting. If no provider can take the job, there is no dispatch. Calling is not a promise that someone is on the way.",
    "Before you authorize drilling, a rekey, or extra hardware, ask to see the credentials the job requires, including Texas DPS Private Security licensing where it applies. ZipProLink does not hold that company license and does not inspect the technician for you.",
  ],
  checklistHeading: "Before you call from 77006",
  checklist: [
    "Stay with the vehicle or door if it is safe to do so.",
    "Have a photo ID ready.",
    "Know that you are in ZIP 77006 and whether it is a car or a home lock.",
    "For a car lockout, note the make and whether the keys are inside.",
    "For a house or apartment, note the building, unit, or nearest cross-street.",
    "Do not force or drill the lock yourself.",
    "Ask the person who arrives for their license before you approve extra work.",
    "Get the on-site estimate confirmed before work starts.",
  ],
  localHeading: "Montrose ZIP 77006 and nearby Houston listings",
  localBody:
    "USPS 77006 is Houston’s Montrose ZIP. Some blocks in this code sit toward Midtown. Use this page when you are in 77006. The neighbor codes below are other Houston listings, not additional storefronts.",
  dpsHeading: "Licensing is yours to check",
  dpsBody:
    "ZipProLink is a referral matching service, not a licensed locksmith company. Texas locksmith work can require a Texas Department of Public Safety Private Security license. We do not claim that a specific technician is licensed until you verify it. Before you authorize the job, ask the person on site for the license and insurance that apply.",
  processHeading: "How the 77006 phone call works",
  processIntro:
    "The number on this page is a tracking line for a locksmith referral in this ZIP. Use it to request a match. It is not a booking for a ZipProLink employee.",
  processSteps: [
    {
      step: 1,
      title: "Call and identify the job",
      detail:
        "Say Houston, ZIP 77006, and whether you are locked out of a car or a home. Stay at a safe place near the vehicle or door.",
    },
    {
      step: 2,
      title: "Intake tries a match",
      detail:
        "The line attempts to connect you with an independent provider. That is not ZipProLink sending its own technician. A match happens only if someone can take the job.",
    },
    {
      step: 3,
      title: "The technician confirms cost on site",
      detail:
        "If a provider accepts, that person confirms the work and the price with you before starting. Catalog ranges on this page are planning numbers, not your quote.",
    },
    {
      step: 4,
      title: "You decide after you check credentials",
      detail:
        "Ask to see the license that applies before you approve drilling or a rekey. You can decline the work if the estimate or the paperwork is not acceptable.",
    },
  ],
  pricingHeading: "Catalog ranges for planning, not a 77006 quote",
  pricingIntro:
    "ZipProLink does not set locksmith prices in Houston 77006. The table is a catalog used across ZIP pages so you can see typical job types. The technician who may arrive confirms the estimate on site. These numbers are not a survey of Montrose jobs and they are not a guaranteed total.",
  faqHeading: "Houston 77006 locksmith questions",
  faqLead:
    "This ZIP page is a listing for 77006, not a shop address. Answers below describe the referral, not a promise of arrival.",
  faqs: [
    {
      question: "How do I get locksmith help in Houston 77006?",
      answer:
        "Call the number on this page. Say you are in Houston ZIP 77006 and whether it is a car or a home lockout. ZipProLink tries to refer an independent locksmith. A referral happens only if a provider is available.",
    },
    {
      question: "Can you help with a car lockout in Montrose?",
      answer:
        "77006 is the Montrose ZIP. Tell intake it is a vehicle lockout and where the car is. A mobile technician may be referred if one can take the job. We cannot promise how soon anyone will arrive.",
    },
    {
      question: "What should I have ready before I call?",
      answer:
        "Have photo ID, the ZIP (77006), and whether it is a car or a residence. For a car, note the make and if the keys are inside. For a home, note the building or cross-street. Do not force the lock while you wait.",
    },
    {
      question: "How is the cost confirmed?",
      answer:
        "ZipProLink does not set the job price. If a provider accepts, that technician confirms the estimate on site before work. The table on this page is a catalog for planning, not a quote for your lock.",
    },
    {
      question: "Does ZipProLink hold a Texas DPS locksmith license?",
      answer:
        "No. ZipProLink is a referral matching service. Independent contractors do the work. You verify the license and insurance required for the job, including Texas DPS Private Security rules where they apply.",
    },
    {
      question: "Do you guarantee 15-minute or 24-hour arrival in 77006?",
      answer:
        "No. You can request a referral by phone. Whether anyone can come depends on provider participation, your exact location, technician availability, and demand. Availability is not guaranteed.",
    },
  ],
};

const ES: Houston77006Copy = {
  documentTitle: "Cerrajero en Houston, TX 77006 — referido",
  headline: "¿Necesita un cerrajero en Houston 77006? Pida un referido",
  metaDescription:
    "¿Se quedó fuera del auto o de la casa en el ZIP 77006 de Houston (Montrose)? Llame para pedir un referido a un cerrajero independiente. Solo hay conexión si hay un proveedor disponible.",
  heroSupport:
    "El ZIP 77006 es el código postal de Montrose en Houston. Llame al número de esta página para pedir un referido por un cierre de auto o de casa. ZipProLink es un servicio de emparejamiento, no un taller de cerrajería. Solo se refiere un técnico si un proveedor independiente puede tomar el trabajo.",
  densityCopy:
    "77006 está en el interior de Houston. Hay viviendas y comercio pequeño. Eso puede complicar el estacionamiento o el acceso al edificio. No cambia el referido: la disponibilidad sigue dependiendo de si un proveedor puede tomar el trabajo.",
  asideTitle: "Este ZIP",
  asideBody:
    "Este listado es para Houston 77006. No es un local en una calle de Montrose. Los ZIP vecinos más abajo son otros listados, no talleres extra.",
  asideMetric: "77006",
  asideMetricLabel: "ZIP Montrose",
  asideDispatch: "Referido",
  asideDispatchValue: "Solo si hay un proveedor disponible",
  chipPrimaryLabel: "Solicitud",
  chipPrimaryValue: "Llame para un referido",
  chipSecondaryLabel: "Costo",
  chipSecondaryValue: "Se cotiza en sitio",
  introHeading: "Ayuda de cerrajero en Houston 77006",
  introParagraphs: [
    "Quienes buscan un cerrajero en Houston a menudo llegan a este ZIP después de un cierre en Montrose o en las cuadras de 77006 que dan hacia Midtown. Los casos habituales son llaves dentro del auto, un control sin batería, o una puerta de casa o departamento que no abre. ZipProLink no envía una camioneta propia ni emplea a quien pueda llegar.",
    "Al llamar, diga que está en Houston, dé el ZIP 77006 y si es un vehículo o una vivienda. Con eso basta para la admisión. Usted pide un emparejamiento con un cerrajero independiente; ZipProLink no es la empresa que abrirá la cerradura.",
    "Puede atender una persona o un menú breve. Si un proveedor acepta, ese técnico confirma el trabajo y el precio con usted antes de empezar. Si nadie puede tomar el trabajo, no hay despacho. Llamar no es una promesa de que alguien va en camino.",
    "Antes de autorizar un taladro, un cambio de combinación o herrajes extra, pida ver las credenciales que exige el trabajo, incluida la licencia de Seguridad Privada de TX DPS cuando aplique. ZipProLink no tiene esa licencia de empresa y no inspecciona al técnico por usted.",
  ],
  checklistHeading: "Antes de llamar desde 77006",
  checklist: [
    "Quédese junto al vehículo o la puerta si es seguro.",
    "Tenga una identificación con foto.",
    "Sepa que está en el ZIP 77006 y si es auto o casa.",
    "Si es un cierre de auto, anote la marca y si las llaves quedaron adentro.",
    "Si es casa o departamento, anote el edificio, la unidad o el cruce más cercano.",
    "No force ni taladre la cerradura usted mismo.",
    "Pida la licencia a quien llegue antes de aprobar trabajo extra.",
    "Confirme el estimado en sitio antes de empezar.",
  ],
  localHeading: "ZIP 77006 de Montrose y listados cercanos en Houston",
  localBody:
    "El 77006 de USPS es el ZIP de Montrose en Houston. Algunas cuadras de este código quedan hacia Midtown. Use esta página si está en 77006. Los códigos vecinos más abajo son otros listados de Houston, no locales adicionales.",
  dpsHeading: "La licencia la verifica usted",
  dpsBody:
    "ZipProLink es un servicio de referidos, no una empresa de cerrajería con licencia. El trabajo de cerrajero en Texas puede exigir licencia de Seguridad Privada del Departamento de Seguridad Pública. No afirmamos que un técnico concreto esté licenciado hasta que usted lo compruebe. Antes de autorizar el trabajo, pida en sitio la licencia y el seguro que correspondan.",
  processHeading: "Cómo funciona la llamada en 77006",
  processIntro:
    "El número de esta página es una línea de seguimiento para un referido de cerrajero en este ZIP. Sirve para pedir un emparejamiento. No es una reserva con un empleado de ZipProLink.",
  processSteps: [
    {
      step: 1,
      title: "Llame e identifique el trabajo",
      detail:
        "Diga Houston, ZIP 77006 y si se quedó fuera del auto o de la casa. Quédese en un lugar seguro junto al vehículo o la puerta.",
    },
    {
      step: 2,
      title: "La admisión intenta un emparejamiento",
      detail:
        "La línea intenta conectarle con un proveedor independiente. Eso no es ZipProLink enviando a su propio técnico. Solo hay emparejamiento si alguien puede tomar el trabajo.",
    },
    {
      step: 3,
      title: "El técnico confirma el costo en sitio",
      detail:
        "Si un proveedor acepta, esa persona confirma el trabajo y el precio con usted antes de empezar. Los rangos de esta página son de catálogo, no su cotización.",
    },
    {
      step: 4,
      title: "Usted decide después de ver las credenciales",
      detail:
        "Pida ver la licencia que aplique antes de aprobar un taladro o un recambio. Puede rechazar el trabajo si el estimado o los papeles no le parecen aceptables.",
    },
  ],
  pricingHeading: "Rangos de catálogo para planear, no una cotización de 77006",
  pricingIntro:
    "ZipProLink no fija precios de cerrajero en Houston 77006. La tabla es un catálogo compartido entre páginas ZIP para mostrar tipos de trabajo. El técnico que pueda llegar confirma el estimado en sitio. No es un estudio de trabajos en Montrose ni un total garantizado.",
  faqHeading: "Preguntas de cerrajero en Houston 77006",
  faqLead:
    "Esta página es un listado del ZIP 77006, no la dirección de un taller. Las respuestas describen el referido, no una promesa de llegada.",
  faqs: [
    {
      question: "¿Cómo pido un cerrajero en Houston 77006?",
      answer:
        "Llame al número de esta página. Diga que está en Houston ZIP 77006 y si es un cierre de auto o de casa. ZipProLink intenta referir a un cerrajero independiente. Solo hay referido si hay un proveedor disponible.",
    },
    {
      question: "¿Pueden ayudar si dejé las llaves en el auto en Montrose?",
      answer:
        "77006 es el ZIP de Montrose. Diga en la llamada que es un cierre de vehículo y dónde está el auto. Puede referirse a un técnico móvil si hay uno disponible. No podemos prometer la hora de llegada.",
    },
    {
      question: "¿Qué debo tener listo antes de llamar?",
      answer:
        "Tenga identificación, el ZIP (77006) y si es auto o vivienda. En un auto, anote la marca y si las llaves quedaron adentro. En una casa, anote el edificio o el cruce. No force la cerradura mientras espera.",
    },
    {
      question: "¿Cómo se confirma el costo?",
      answer:
        "ZipProLink no fija el precio del trabajo. Si un proveedor acepta, ese técnico confirma el estimado en sitio antes de empezar. La tabla de esta página es un catálogo para planear, no una cotización para su cerradura.",
    },
    {
      question: "¿ZipProLink tiene licencia de cerrajero de TX DPS?",
      answer:
        "No. ZipProLink es un servicio de referidos. El trabajo lo hacen contratistas independientes. Usted verifica la licencia y el seguro exigidos, incluidas las reglas de Seguridad Privada de TX DPS cuando apliquen.",
    },
    {
      question: "¿Garantizan llegada en 15 minutos o las 24 horas en 77006?",
      answer:
        "No. Puede pedir un referido por teléfono. Que alguien pueda ir depende de la participación del proveedor, su ubicación exacta, la disponibilidad del técnico y la demanda. La disponibilidad no está garantizada.",
    },
  ],
};

const SECTION_ORDER: PageVariation["sectionOrder"] = [
  "process",
  "checklist",
  "pricing",
  "local",
  "dps",
  "faq",
];

export function getHouston77006HubLink(locale: AppLocale): Houston77006HubLink {
  const href = directoryPath({
    locale,
    service: "locksmith",
    state: "TX",
    city: "Houston",
  });

  if (locale === "es") {
    return {
      href,
      before: "Para la guía de la ciudad, abra",
      label: "cerrajero en Houston",
      after: ".",
    };
  }

  return {
    href,
    before: "For Houston-wide lockout help, open",
    label: "locksmith help in Houston",
    after: ".",
  };
}

export function applyHouston77006Overlay(
  variation: PageVariation,
  locale: AppLocale,
): PageVariation {
  const copy = locale === "es" ? ES : EN;

  return {
    ...variation,
    showPricingInHero: false,
    showNeighborsInHero: false,
    sectionOrder: SECTION_ORDER,
    densityCopy: copy.densityCopy,
    documentTitle: copy.documentTitle,
    headline: copy.headline,
    heroSupport: copy.heroSupport,
    asideTitle: copy.asideTitle,
    asideBody: copy.asideBody,
    asideMetric: copy.asideMetric,
    asideMetricLabel: copy.asideMetricLabel,
    asideDispatchValue: copy.asideDispatchValue,
    chipPrimaryLabel: copy.chipPrimaryLabel,
    chipPrimaryValue: copy.chipPrimaryValue,
    chipSecondaryLabel: copy.chipSecondaryLabel,
    chipSecondaryValue: copy.chipSecondaryValue,
    introHeading: copy.introHeading,
    introParagraphs: copy.introParagraphs,
    checklistHeading: copy.checklistHeading,
    checklist: copy.checklist,
    localHeading: copy.localHeading,
    localBody: copy.localBody,
    dpsHeading: copy.dpsHeading,
    dpsBody: copy.dpsBody,
    processHeading: copy.processHeading,
    processIntro: copy.processIntro,
    processSteps: copy.processSteps,
    pricingHeading: copy.pricingHeading,
    pricingIntro: copy.pricingIntro,
    faqHeading: copy.faqHeading,
    faqLead: copy.faqLead,
    faqs: copy.faqs,
    metaDescription: copy.metaDescription,
    chrome: {
      ...variation.chrome,
      asideDispatch: copy.asideDispatch,
    },
    jobEstimates: variation.jobEstimates,
    pricingTableLabels: variation.pricingTableLabels,
  };
}

export function overlayZipVariationIfHouston77006(
  variation: PageVariation,
  city: string,
  stateId: string,
  zipCode: string,
  locale: AppLocale,
): PageVariation {
  if (!isHouston77006Page(city, stateId, zipCode)) {
    return variation;
  }
  return applyHouston77006Overlay(variation, locale);
}
