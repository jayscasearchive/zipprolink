import type { AppLocale } from "@/lib/i18n";
import type { FaqItem } from "@/lib/types";

export const HOUSTON_CITY_SLUG = "houston";

export function isHoustonCityHub(citySlugValue: string, stateSlugValue: string) {
  return (
    citySlugValue.toLowerCase() === HOUSTON_CITY_SLUG &&
    stateSlugValue.toLowerCase() === "tx"
  );
}

export type HoustonHubCopy = {
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
  zipHeading: string;
  zipLead: string;
  faqHeading: string;
  faqs: FaqItem[];
};

const EN: HoustonHubCopy = {
  title: "Emergency locksmith referral in Houston, TX",
  description:
    "Locked out of a car or home in Houston? Call ZipProLink to request a referral to an independent locksmith. A technician is referred only if a provider is available. Open your ZIP for the local listing.",
  h1: "Locked out in Houston? Request a locksmith referral",
  lead:
    "ZipProLink is a referral matching service, not a locksmith shop. Call the number on this page if you need help with a car or home lockout in Houston. We try to connect you with an independent technician. That is not a promise that someone will arrive.",
  sections: [
    {
      heading: "If you are locked out now",
      paragraphs: [
        "Stay with the vehicle or door if it is safe. Do not force the lock or drill it yourself. Have a photo ID ready. If this is a car lockout, note the location, make, and whether the keys are inside. If this is a house or apartment, note the building or cross-street and whether anyone is locked inside.",
        "When you call, say it is Houston, give the five-digit ZIP, and say whether it is a car or a home. That is enough for intake. A referral is attempted only if an independent provider can take the job.",
      ],
    },
    {
      heading: "How the phone call works",
      paragraphs: [
        "The number on this page is a tracking line for a locksmith referral. A live person may answer, or you may hear a short menu. You are requesting a match, not booking ZipProLink as the company that will open the lock.",
        "If a provider accepts, that technician confirms the work and the price with you. ZipProLink does not employ locksmiths and does not send a branded van.",
      ],
    },
    {
      heading: "Cost and availability",
      paragraphs: [
        "There is no ZipProLink price for Houston. The technician quotes on site before work begins. ZIP pages below show catalog ranges for planning only. They are not a survey of Houston jobs and they are not a guaranteed total.",
        "You can call to request help. Call intake is not the same as a technician on the way. Whether anyone can come depends on provider participation, your location, technician availability, and demand. We do not guarantee same-day or overnight arrival.",
      ],
    },
    {
      heading: "Independent providers",
      paragraphs: [
        "Providers are independent contractors. ZipProLink does not warrant or guarantee their work. Before you authorize drilling or a rekey, it is your responsibility to verify that the person who arrives has the license and insurance required for the job, including Texas DPS Private Security rules where they apply.",
      ],
    },
  ],
  zipHeading: "Choose the Houston ZIP closest to you",
  zipLead:
    "Each link is a listing for that ZIP, not a shop address. Open the code where you are so the referral can use the right area.",
  faqHeading: "Houston locksmith questions",
  faqs: [
    {
      question: "How do I get locksmith help in Houston?",
      answer:
        "Call the number on this page. Give your ZIP and say whether you are locked out of a car or a home. ZipProLink tries to refer an independent locksmith. A referral happens only if a provider is available.",
    },
    {
      question: "Can you help with a car lockout in Houston?",
      answer:
        "Tell the intake line it is a vehicle lockout and where the car is. A mobile technician may be referred if one can take the job. We cannot promise how soon anyone will arrive.",
    },
    {
      question: "What if I am locked out of my house or apartment?",
      answer:
        "Have photo ID ready and know the address or cross-street. Ask to see the provider's license before you authorize drilling. ZipProLink does not open doors and does not employ the technician.",
    },
    {
      question: "How much does a locksmith cost in Houston?",
      answer:
        "ZipProLink does not set the job price. The technician confirms the estimate on site before work. Catalog ranges on ZIP pages are planning numbers, not a quote for your lock.",
    },
    {
      question: "Do you guarantee 24-hour locksmith service in Houston?",
      answer:
        "No. You can request a referral by phone. Dispatch depends on provider participation, location, technician availability, and demand. Availability is not guaranteed.",
    },
    {
      question: "Is ZipProLink a Houston locksmith company?",
      answer:
        "No. It is a referral matching service. Independent contractors do the work. ZipProLink does not warrant that work. You verify license and insurance before the job starts.",
    },
  ],
};

const ES: HoustonHubCopy = {
  title: "Cerrajero de emergencia en Houston, TX — referido",
  description:
    "¿Se quedó fuera del auto o de la casa en Houston? Llame para pedir un referido a un cerrajero independiente. Solo se envía un técnico si hay un proveedor disponible. Abra su ZIP para el listado local.",
  h1: "¿Se quedó fuera en Houston? Pida un referido de cerrajero",
  lead:
    "ZipProLink es un servicio de emparejamiento por referido, no un taller de cerrajería. Si necesita ayuda por un cierre de auto o de casa en Houston, llame al número de esta página. Intentamos conectarle con un técnico independiente. Eso no es una promesa de que alguien vaya a llegar.",
  sections: [
    {
      heading: "Si acaba de quedarse fuera",
      paragraphs: [
        "Quédese junto al vehículo o la puerta si es seguro. No force ni taladre la cerradura. Tenga una identificación lista. Si es un cierre de auto, anote el lugar, la marca y si las llaves quedaron adentro. Si es una casa o departamento, anote el edificio o el cruce y si hay alguien encerrado.",
        "Al llamar, diga que está en Houston, dé el ZIP de cinco dígitos y si es auto o casa. Con eso basta para la admisión. El referido se intenta solo si un proveedor independiente puede tomar el trabajo.",
      ],
    },
    {
      heading: "Cómo funciona la llamada",
      paragraphs: [
        "El número de esta página es una línea de seguimiento para un referido de cerrajero. Puede atender una persona o un menú breve. Usted pide un emparejamiento; ZipProLink no es la empresa que abrirá la cerradura.",
        "Si un proveedor acepta, ese técnico confirma el trabajo y el precio con usted. ZipProLink no emplea cerrajeros ni envía una camioneta propia.",
      ],
    },
    {
      heading: "Costo y disponibilidad",
      paragraphs: [
        "ZipProLink no fija un precio para Houston. El técnico cotiza en sitio antes de empezar. Las páginas ZIP más abajo muestran rangos de catálogo solo para planear. No son un estudio de trabajos en Houston ni un total garantizado.",
        "Puede llamar para pedir ayuda. La admisión de la llamada no es lo mismo que un técnico en camino. Que alguien pueda ir depende de la participación del proveedor, su ubicación, la disponibilidad del técnico y la demanda. No garantizamos llegada el mismo día ni de madrugada.",
      ],
    },
    {
      heading: "Proveedores independientes",
      paragraphs: [
        "Los proveedores son contratistas independientes. ZipProLink no garantiza su trabajo. Antes de autorizar un taladro o un cambio de combinación, es su responsabilidad verificar que quien llega tenga la licencia y el seguro exigidos, incluidas las reglas de Seguridad Privada de TX DPS cuando apliquen.",
      ],
    },
  ],
  zipHeading: "Elija el ZIP de Houston más cercano",
  zipLead:
    "Cada enlace es un listado de ese código postal, no la dirección de un taller. Abra el ZIP donde está para que el referido use la zona correcta.",
  faqHeading: "Preguntas sobre cerrajero en Houston",
  faqs: [
    {
      question: "¿Cómo pido un cerrajero en Houston?",
      answer:
        "Llame al número de esta página. Dé su ZIP y diga si se quedó fuera del auto o de la casa. ZipProLink intenta referir a un cerrajero independiente. Solo hay referido si hay un proveedor disponible.",
    },
    {
      question: "¿Ayudan si dejé las llaves en el auto?",
      answer:
        "Diga en la llamada que es un cierre de vehículo y dónde está el auto. Puede referirse a un técnico móvil si hay uno disponible. No podemos prometer la hora de llegada.",
    },
    {
      question: "¿Y si me quedé fuera de la casa o el departamento?",
      answer:
        "Tenga una identificación y sepa la dirección o el cruce. Pida ver la licencia del proveedor antes de autorizar un taladro. ZipProLink no abre puertas ni emplea al técnico.",
    },
    {
      question: "¿Cuánto cuesta un cerrajero en Houston?",
      answer:
        "ZipProLink no fija el precio del trabajo. El técnico confirma el estimado en sitio. Los rangos de las páginas ZIP son números de catálogo, no una cotización para su cerradura.",
    },
    {
      question: "¿Garantizan cerrajero las 24 horas en Houston?",
      answer:
        "No. Puede pedir un referido por teléfono. El despacho depende de la participación del proveedor, la ubicación, la disponibilidad del técnico y la demanda. La disponibilidad no está garantizada.",
    },
    {
      question: "¿ZipProLink es una empresa de cerrajería en Houston?",
      answer:
        "No. Es un servicio de referidos. El trabajo lo hacen contratistas independientes. ZipProLink no garantiza ese trabajo. Usted verifica licencia y seguro antes de empezar.",
    },
  ],
};

export function getHoustonHubCopy(locale: AppLocale): HoustonHubCopy {
  return locale === "es" ? ES : EN;
}
