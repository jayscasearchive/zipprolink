import { HOTLINE_DISPLAY } from "@/lib/constants";
import { currentSeoYear } from "@/lib/content";
import type { CopyContext, IntentPack } from "@/lib/variation/pools";
import type { DensityBand, LayoutId, PageChrome, PricingTableLabels } from "@/lib/variation/types";

export const PAGE_CHROME_ES: PageChrome = {
  asideDispatch: "Despacho promedio",
  asideZip: "ZIP de cobertura",
  asideArea: "Tipo de zona",
};

export const PRICING_TABLE_ES: PricingTableLabels = {
  service: "Servicio",
  cost: "Rango de costo",
  dispatch: "Tiempo de despacho",
  note: "Nota local",
  disclaimer:
    "Los rangos son estimados para este ZIP. El técnico confirma la cotización en sitio antes de iniciar el trabajo.",
};

export function densityLabelEs(band: DensityBand) {
  return band === "urban" ? "Urbano de alta densidad" : "Residencial suburbano";
}

export function densityCopyEs(ctx: CopyContext) {
  if (ctx.densityBand === "urban") {
    return `${ctx.place} está en un corredor urbano de alta densidad${ctx.county !== "the local" ? ` del condado de ${ctx.county}` : ""}. Calles estrechas, estacionamientos en torre y cierres de oficina de madrugada son comunes, así que ZipProLink envía cerrajeros que ya cubren este ZIP en lugar de un técnico solo suburbano.`;
  }

  return `${ctx.place} es una zona residencial suburbana${ctx.county !== "the local" ? ` en el condado de ${ctx.county}` : ""}. Entradas, portones de HOA y cerraduras de casa unifamiliar dominan las llamadas nocturnas, así que el despacho prioriza técnicos cerca de las avenidas del vecindario.`;
}

function countyLabel(ctx: CopyContext) {
  return ctx.county === "the local" ? "este condado" : `el condado de ${ctx.county}`;
}

export const ES_INTENTS: Record<LayoutId, IntentPack> = {
  emergency: {
    hooks: [
      (ctx) => ({
        headline: `Despacho de cerrajero de emergencia 24/7 en ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
        support: `¿Quedó cerrado fuera de casa, auto u oficina en ${ctx.place}? Llame al ${HOTLINE_DISPLAY}. Un técnico con licencia suele salir en unos ${ctx.responseTime}. Usted aprueba el estimado en sitio antes de cualquier trabajo.`,
      }),
      (ctx) => ({
        headline: `¿Cerrado fuera en ${ctx.city} ${ctx.zip}? Enrutamiento de cerrajero de emergencia`,
        support: `Cierres de noche, fin de semana y día festivo en ${countyLabel(ctx)} siguen en un escritorio en vivo. Llegada típica ${ctx.responseTime}. No force la puerta y dé el edificio o el cruce exacto.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `Cuando un cierre de emergencia llega a ${ctx.city} ${ctx.zip}`,
      paragraphs: [
        `La mayoría de las llamadas en ${ctx.zip} empiezan igual: llaves en la cocina, un control muerto en el estacionamiento o una llave rota en un cilindro ${ctx.densityBand === "urban" ? "de torre" : "de la puerta"} después de medianoche. ZipProLink es el escritorio de emergencia de ese momento: una ruta de despacho hacia ${countyLabel(ctx)}, no una granja de cupones.`,
        `Como ${ctx.place} es un ZIP ${ctx.densityLabel.toLowerCase()}, primero van los técnicos que ya cubren las noches de ${ctx.city}. Usted oye la ventana de llegada (${ctx.responseTime}) antes de que salga nadie.`,
      ],
      checklistHeading: `Qué cubre un cerrajero de emergencia en ${ctx.city} esta noche`,
      localHeading: `ZIP cercanos en el tablero de emergencia de ${ctx.city}`,
      localBody: `Estos códigos comparten el mismo escritorio de despacho de ${ctx.stateId} que ${ctx.zip}. Si está justo fuera de este ZIP, abra el listado más cercano para que el técnico ya esté en ${countyLabel(ctx)}.`,
    }),
    aside: (ctx) => ({
      title: "Ventana de emergencia",
      body: `Los cierres en ${ctx.zip} suelen resolverse en ${ctx.responseTime}. Llame al ${HOTLINE_DISPLAY} con el edificio o la subdivisión exactos.`,
      metric: ctx.responseTime,
      metricLabel: "Llegada típica",
    }),
    chips: (ctx) => ({
      primaryLabel: "Despacho",
      primaryValue: ctx.responseTime,
      secondaryLabel: "Estimado",
      secondaryValue: "En sitio, antes del trabajo",
    }),
    dps: (ctx) => ({
      heading: `Acceso de emergencia con licencia en ${ctx.city}`,
      body: `El Código de Ocupaciones de Texas, Capítulo 1702, pone a las empresas de cerrajería bajo Seguridad Privada de TX DPS. El enrutamiento de emergencia a ${ctx.zip} sigue exigiendo una empresa que pueda servir legalmente ${countyLabel(ctx)}. Pida ver la licencia antes de autorizar un taladro.`,
    }),
    process: (ctx) => ({
      heading: `Cómo funciona el despacho de emergencia en ${ctx.zip}`,
      intro: `Tres pasos y un técnico con licencia se mueve hacia ${ctx.place}. Llame al ${HOTLINE_DISPLAY}.`,
      steps: [
        {
          step: 1,
          title: "Admisión de cierre 24/7",
          detail: `Indique el ZIP ${ctx.zip}, el tipo de cerradura y si hay alguien adentro. Noches y festivos están cubiertos.`,
        },
        {
          step: 2,
          title: "Técnico más cercano disponible",
          detail: `Emparejamos un cerrajero de ${countyLabel(ctx)} que ya cubre este tablero ${ctx.densityLabel.toLowerCase()} en lugar de una cola estatal lejana.`,
        },
        {
          step: 3,
          title: "Llegada y autorización",
          detail: `El técnico confirma ocupación, inspecciona el cilindro o el vehículo y cotiza antes del trabajo. Usted aprueba — luego abren o cambian la combinación.`,
        },
      ],
    }),
    checklist: [
      "Cierres de casa, departamento y portón de HOA fuera de horario",
      "Cierres de auto e ignición en estacionamientos",
      "Extracción de llave rota sin cambiar todo el cilindro",
      "Cambio de combinación tras mudanza, roomie o robo",
      "Ayuda si hay un niño, mascota o adulto mayor adentro",
      "Fallos de oficina o local comercial la misma noche",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `¿Qué tan rápido puede llegar un cerrajero a ${ctx.place} en una emergencia?`,
        answer: `El despacho promedio para ${ctx.zip} es ${ctx.responseTime}. Las llamadas ${ctx.densityBand === "urban" ? "de centro y torres" : "de entrada suburbana"} se asignan a técnicos que ya están en ${countyLabel(ctx)}. Llame al ${HOTLINE_DISPLAY} con el edificio o el cruce exacto.`,
      },
      {
        question: `¿Qué debo hacer mientras espero al cerrajero en ${ctx.zip}?`,
        answer: `Quédese junto a la puerta o el vehículo, tenga localizados a niños y mascotas y no force el cilindro. Tenga una identificación lista. Si hay alguien encerrado adentro, dígalo en la llamada para priorizar el ticket.`,
      },
      {
        question: `¿Hay cerrajero de emergencia fuera de horario en ${ctx.city} los fines de semana?`,
        answer: `Sí. La cobertura es 24/7, incluidos fines de semana y festivos de Texas. ${ctx.zip} sigue en un escritorio en vivo — no espera al lunes por la mañana.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `¿Pueden abrir mi auto en ${ctx.zip} sin dañar la puerta?`,
        answer: `La entrada no destructiva es el valor por defecto en ${ctx.city}. Taladrar o cambiar herraje es el último recurso y se cotiza antes de hacerlo.`,
      },
      {
        question: `¿Un cerrajero de otro ZIP de ${ctx.city} igual viene a ${ctx.zip}?`,
        answer: `Sí, si es el más cercano disponible. Los códigos vecinos de esta página comparten el tablero de ${ctx.stateId}. Aun así preferimos un técnico de ${countyLabel(ctx)} ya cerca de ${ctx.zip}.`,
      },
      {
        question: `¿Pago solo por oír un estimado de emergencia en ${ctx.city}?`,
        answer: `No. No se cobra por oír el estimado en sitio. Confirme el total antes de cualquier apertura, rekey o trabajo de herraje.`,
      },
      {
        question: `¿Qué pasa si un niño o mascota quedó encerrado en ${ctx.zip}?`,
        answer: `Dígalo de inmediato en la llamada. Admisión marca el ticket para empujar primero al técnico más cercano del tablero de ${ctx.city}.`,
      },
      {
        question: `¿Puede el técnico cambiar la combinación en la misma visita tras un cierre en ${ctx.city}?`,
        answer: `A menudo sí, cuando los cilindros lo permiten. El rekey después de un cierre es un seguimiento común en ${ctx.zip} y se cotiza antes de cambiar pines.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Rangos de cerrajero de emergencia para ${ctx.city} ${ctx.zip}`,
      intro: `Los trabajos típicos caen en ${ctx.priceRange}. La tabla es un rango de planificación — el técnico confirma el número en sitio.`,
    }),
    faqHeading: (ctx) => `Preguntas de emergencia para ${ctx.zip}`,
    faqLead: (ctx) =>
      `Respuestas centradas en despacho para ${ctx.place}. Costo y licencia siguen más abajo; este bloque se queda en el tiempo de llegada.`,
    meta: (ctx) =>
      `Despacho de cerrajero de emergencia 24/7 en ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Llegada típica ${ctx.responseTime}. Llame al ${HOTLINE_DISPLAY}.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Los ZIP cercanos de ${stateName} aparecerán aquí a medida que se amplíe la cobertura.`,
  },
  cost: {
    hooks: [
      (ctx) => {
        const year = currentSeoYear();
        return {
          headline: `${year} Costo de cerrajero en ${ctx.city}, ${ctx.stateId} ${ctx.zip}`,
          support: `Los trabajos típicos en ${ctx.city} rondan ${ctx.priceRange}. Ventana de llegada unos ${ctx.responseTime}. Nada aquí es una oferta vinculante — usted aprueba el estimado en sitio antes de taladrar o cambiar la combinación.`,
        };
      },
      (ctx) => ({
        headline: `Precios y rangos de despacho de cerrajero en ${ctx.city} ${ctx.zip}`,
        support: `Compare rangos de apertura, rekey y cerradura inteligente para ${ctx.place}. El precio ${ctx.densityLabel.toLowerCase()} se ajusta a este ZIP, no a un promedio estatal.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `Cuánto cuesta el trabajo de cerrajero de emergencia en ${ctx.zip}`,
      paragraphs: [
        `Quien llama en ${ctx.city} quiere el número antes de que salga la camioneta. En ${ctx.place}, el trabajo típico de emergencia cae en ${ctx.priceRange}, con llegada alrededor de ${ctx.responseTime}. La densidad cambia estacionamiento y manejo — la tabla parte trabajos comunes para que ${ctx.zip} no herede un promedio estatal genérico.`,
        `Nada en esta página es una oferta vinculante. Los cerrajeros de Texas confirman el cilindro, el vehículo o el local en sitio. Usted aprueba el estimado antes de taladrar, cambiar la combinación o reemplazar herraje.`,
      ],
      checklistHeading: `Tipos de trabajo con precio para las noches de ${ctx.city}`,
      localHeading: `Compare páginas de costo de ZIP vecinos de ${ctx.stateId}`,
      localBody: `Abra un código más cercano si no está realmente en ${ctx.zip}. Cada listado lleva su propio rango local para que las páginas de ${countyLabel(ctx)} no clonen un solo bloque de precios estatal.`,
    }),
    aside: (ctx) => ({
      title: "Rango por adelantado",
      body: `${ctx.priceRange} cubre la mayoría de aperturas y rekeys en ${ctx.zip}. Cajas fuertes, herraje comercial o cilindros de alta seguridad se cotizan después de la inspección.`,
      metric: ctx.priceRange,
      metricLabel: "Trabajos típicos",
    }),
    chips: (ctx) => ({
      primaryLabel: "Costo",
      primaryValue: ctx.priceRange,
      secondaryLabel: "Despacho",
      secondaryValue: ctx.responseTime,
    }),
    dps: (ctx) => ({
      heading: `Las cotizaciones siguen bajo normas TX DPS en ${ctx.city}`,
      body: `Un número bajo no anula la licencia. Las empresas enviadas a ${ctx.zip} operan bajo el Capítulo 1702. Confirme la licencia de la empresa cuando llegue el técnico — precio y legalidad son chequeos aparte.`,
    }),
    process: (ctx) => ({
      heading: `Cómo se confirma una cotización en ${ctx.zip}`,
      intro: `Los rangos de esta página son números de planificación. El estimado en sitio es el número que usted aprueba.`,
      steps: [
        {
          step: 1,
          title: "Indique el tipo de trabajo",
          detail: `Apertura, rekey, extracción o herraje — el ZIP ${ctx.zip} y el tipo de cerradura nos dejan empezar dentro de ${ctx.priceRange}.`,
        },
        {
          step: 2,
          title: "El técnico inspecciona en sitio",
          detail: `Cilindros de alta seguridad, barras antipánico o vehículos dañados pueden mover el número. Usted lo oye antes de que empiece el trabajo.`,
        },
        {
          step: 3,
          title: "Usted aprueba y luego se trabaja",
          detail: `Sin cebo de cargo de viaje oculto. Pague después de aceptar el estimado de esta visita en ${ctx.city}.`,
        },
      ],
    }),
    checklist: [
      "Rangos de apertura de auto en calle y garage",
      "Rangos de apertura de casa y departamento en ${city} ${zip}",
      "Rekey tras mudanza, roomie o llave perdida",
      "Instalación de cerradura inteligente cotizada antes de emparejar",
      "Extracción de llave rota cuando se puede salvar el cilindro",
      "El trabajo fuera de horario se queda en la banda publicada salvo que el trabajo cambie",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `¿Cuánto cuesta el servicio de cerrajero de emergencia en ${ctx.zip}?`,
        answer: `La mayoría de los trabajos de emergencia en ${ctx.city} caen en ${ctx.priceRange}. Cilindros de alta seguridad, barras antipánico o cajas fuertes se cotizan después de la inspección. Recibe el número antes de taladrar o cambiar la combinación.`,
      },
      {
        question: `¿Los cerrajeros de ${ctx.city} cobran viaje u horario extra por separado?`,
        answer: `Pregunte en la llamada de admisión. Los rangos de esta página de ${ctx.zip} son bandas de planificación para trabajos típicos. Si aplica un recargo de viaje o festivo, debe decirse antes de que salga el técnico.`,
      },
      {
        question: `¿Cuándo pago el trabajo de cerrajero en ${ctx.zip}?`,
        answer: `Después de aprobar el estimado en sitio. La mayoría de los técnicos de ${ctx.city} aceptan tarjeta, débito y billeteras digitales. No se cobra solo por oír la cotización.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `¿Por qué el precio urbano de ${ctx.city} a veces es más alto que un ZIP suburbano?`,
        answer: `Estacionamiento, acceso a garage y reglas de edificio fuera de horario suman tiempo. ${ctx.zip} está clasificado como ${ctx.densityLabel.toLowerCase()}, así que la tabla se ajusta a ese patrón — no se copia de otra ciudad de Texas.`,
      },
      {
        question: `¿El rango de esta página es una oferta garantizada para ${ctx.place}?`,
        answer: `No. Es un rango local de planificación. El cerrajero inspecciona la cerradura o el vehículo en ${ctx.zip} y usted aprueba el número real.`,
      },
      {
        question: `¿Cuánto cuesta un rekey después de un cierre en ${ctx.city}?`,
        answer: `El rekey aparece aparte en la tabla. Combinar apertura y rekey en una visita es común en ${ctx.zip} y se cotiza línea por línea.`,
      },
      {
        question: `¿Las instalaciones de cerradura inteligente entran en la banda ${ctx.priceRange}?`,
        answer: `Por lo general no. El herraje y el emparejado se cotizan en sitio. La banda publicada cubre entrada de emergencia típica y rekey estándar en ${ctx.zip}.`,
      },
      {
        question: `¿Puedo comparar esta tabla de ${ctx.zip} con un ZIP vecino?`,
        answer: `Sí. Use los listados cercanos de esta página. Cada código guarda su propio rango para que ${countyLabel(ctx)} no comparta una sola tabla estatal clonada.`,
      },
    ],
    pricing: (ctx) => {
      const year = currentSeoYear();
      return {
        heading: `${year} Costos y tiempos de despacho de cerrajero en ${ctx.city}`,
        intro: `Rangos de emergencia y ventanas de llegada para el ZIP ${ctx.zip} en ${ctx.city}, ajustados a esta zona ${ctx.densityLabel.toLowerCase()}.`,
      };
    },
    faqHeading: (ctx) => `Preguntas de costo para ${ctx.zip}`,
    faqLead: (ctx) =>
      `Respuestas centradas en precio para ${ctx.place}. El despacho y la licencia siguen aplicando; este bloque se queda en lo que paga.`,
    meta: (ctx) => {
      const year = currentSeoYear();
      return `${year} costo de cerrajero en ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Rango típico ${ctx.priceRange}. Despacho unos ${ctx.responseTime}.`.slice(
        0,
        160,
      );
    },
    neighborsEmpty: (stateName) =>
      `Los ZIP cercanos de ${stateName} aparecerán aquí a medida que se amplíe la cobertura.`,
  },
  compliance: {
    hooks: [
      (ctx) => ({
        headline: `Cerrajero con licencia en ${ctx.city}, ${ctx.stateId} ${ctx.zip} (TX DPS)`,
        support: `El Código de Ocupaciones de Texas, Capítulo 1702, pone a las empresas de cerrajería bajo el Programa de Seguridad Privada del Departamento de Seguridad Pública de Texas. ZipProLink envía trabajos de ${ctx.zip} a empresas que pueden servir legalmente ${countyLabel(ctx)}.`,
      }),
      (ctx) => ({
        headline: `Normas TX DPS de cerrajería para ${countyLabel(ctx)} · ${ctx.zip}`,
        support: `Pida al técnico que llega la licencia de la empresa antes de cualquier taladro en ${ctx.place}. El seguro en la camioneta es parte del mismo chequeo — una llamada barata sin licencia no es un atajo.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `Trabajo con licencia en ${countyLabel(ctx)}, no un servicio gris`,
      paragraphs: [
        `Para ${ctx.place}, el filtro es legal: ZipProLink solo enruta técnicos que pueden servir este ZIP bajo las reglas de Seguridad Privada de TX DPS. ${ctx.city} ${ctx.zip} es territorio ${ctx.densityLabel.toLowerCase()}, lo que cambia el posicionamiento, no la barra de licencia.`,
        `Si quien llama en ${ctx.zip} necesita un rekey después de un robo, el rastro documental debe sostenerse en ${countyLabel(ctx)}. Puede pedir el nombre de la licencia de la empresa antes de que empiece el trabajo.`,
      ],
      checklistHeading: `Trabajos de cerrajero conformes que enrutamos en ${ctx.zip}`,
      localHeading: `ZIP con licencia de ${countyLabel(ctx)} junto a ${ctx.zip}`,
      localBody: `Estos códigos cercanos de ${ctx.stateName} usan el mismo banco con licencia. Abrir un ZIP vecino mantiene honestos los enlaces internos y hace que ${ctx.city} se vea como un clúster, no como páginas clonadas.`,
    }),
    aside: (ctx) => ({
      title: "Resumen de cumplimiento",
      body: `Las normas de Seguridad Privada de TX DPS aplican al despacho de cerrajeros en ${ctx.city}. Pida al técnico que llega los datos de licencia de la empresa antes de trabajar en ${ctx.zip}.`,
      metric: "TX DPS",
      metricLabel: "Piso de licencia",
    }),
    chips: (ctx) => ({
      primaryLabel: "Licencia",
      primaryValue: "TX DPS PSB",
      secondaryLabel: "Despacho",
      secondaryValue: ctx.responseTime,
    }),
    dps: (ctx) => ({
      heading: `Qué significa “con licencia en Texas” para ${ctx.zip}`,
      body: `TX DPS exige que las empresas de cerrajería tengan licencia de Seguridad Privada, el seguro que el programa espera y las reglas locales de acceso de emergencia. Antes de empezar en ${ctx.place}, puede pedir el nombre de la licencia. Si no se puede mostrar, no autorice el taladro.`,
    }),
    process: (ctx) => ({
      heading: `Cómo mantenemos los trabajos de ${ctx.zip} dentro de la ley`,
      intro: `El emparejamiento de referidos no es una licencia. La empresa que llega sostiene la autorización de TX DPS.`,
      steps: [
        {
          step: 1,
          title: "Admisión en un ZIP real",
          detail: `Fijamos ${ctx.zip} para que el ticket no salga como un trabajo estatal de “llave móvil”.`,
        },
        {
          step: 2,
          title: "Empareje con empresa licenciada",
          detail: `El taller enrutado debe poder trabajar en ${countyLabel(ctx)} bajo el Capítulo 1702 — ZipProLink no envía operadores sin licencia.`,
        },
        {
          step: 3,
          title: "Verificación en sitio",
          detail: `Puede pedir licencia y prueba de ocupación o propiedad del vehículo antes de usar fuerza.`,
        },
      ],
    }),
    checklist: [
      "Solo empresas elegibles bajo Seguridad Privada de TX DPS",
      "Prueba de ocupación o propiedad del vehículo cuando la situación lo permite",
      "Entrada no destructiva primero — taladro solo si el cilindro está muerto",
      "Rekey tras robo con rastro documental para el condado de ${county}",
      "Seguro en la camioneta antes de reemplazar herraje",
      "No se despachan operadores grises de “llave móvil” a ${zip}",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `¿Los cerrajeros en ${ctx.city} deben tener licencia TX DPS PSB?`,
        answer: `Sí. El Capítulo 1702 coloca a las empresas de cerrajería bajo la Oficina de Seguridad Privada de TX DPS. ZipProLink es un servicio de referidos — la empresa que llega sostiene la licencia. Pídala en sitio antes de autorizar trabajo en ${ctx.zip}.`,
      },
      {
        question: `¿ZipProLink sostiene la licencia de cerrajero de TX DPS?`,
        answer: `No. ZipProLink es una capa de directorio y despacho para ${ctx.place}. La empresa de cerrajería que llega sostiene la autorización de Seguridad Privada de TX DPS. No enviamos operadores sin licencia a ${ctx.zip}.`,
      },
      {
        question: `¿Qué prueba debo mostrar a un cerrajero en ${ctx.zip}?`,
        answer: `Identificación con foto más prueba de que pertenece a la dirección o al vehículo (contrato, registro, placa/VIN) cuando la situación lo permite. Los operadores piden al técnico verificar en sitio bajo las normas de acceso de emergencia de TX DPS.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `¿Y si el técnico que llega no puede mostrar licencia en ${ctx.city}?`,
        answer: `No autorice taladro ni rekey. Llame al ${HOTLINE_DISPLAY} para reasignar una empresa que pueda servir legalmente ${ctx.zip}.`,
      },
      {
        question: `¿Un cerrajero más barato sin licencia ahorra dinero en ${ctx.zip}?`,
        answer: `Arriesga daños a la propiedad, falta de seguro y nula posición bajo el Capítulo 1702. El enrutamiento con licencia es el piso en ${countyLabel(ctx)}, no un extra.`,
      },
      {
        question: `¿Los cierres de auto en ${ctx.city} se tratan igual que los de casa bajo TX DPS?`,
        answer: `La empresa sigue necesitando la licencia adecuada. La prueba de propiedad del vehículo (registro, placa, VIN) es el chequeo habitual en sitio para trabajos de auto en ${ctx.zip}.`,
      },
      {
        question: `¿Quién está asegurado — ZipProLink o el técnico en ${ctx.zip}?`,
        answer: `El contratista independiente / la empresa de cerrajería carga el seguro. ZipProLink refiere; no emplea al técnico que llega a ${ctx.place}.`,
      },
      {
        question: `¿Puede el HOA o la seguridad del edificio en ${ctx.city} pedir ID extra?`,
        answer: `Sí. Las propiedades ${ctx.densityLabel.toLowerCase()} urbanas o con portón suelen sumar sus propias reglas encima de TX DPS. Tenga ID lista para ${ctx.zip}.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Rangos de costo de trabajo con licencia en ${ctx.city} ${ctx.zip}`,
      intro: `El trabajo típico con licencia sigue cayendo en ${ctx.priceRange}. Un número más bajo sin licencia no es un sustituto válido en ${countyLabel(ctx)}.`,
    }),
    faqHeading: (ctx) => `Preguntas de licencia para ${ctx.zip}`,
    faqLead: (ctx) =>
      `Respuestas centradas en TX DPS para ${ctx.place}. Precio y llegada siguen importando; este bloque se queda en quién es legal enviar.`,
    meta: (ctx) =>
      `Cerrajero con licencia en ${ctx.city}, ${ctx.stateId} ${ctx.zip}. Enrutamiento TX DPS para ${countyLabel(ctx)}. Llame al ${HOTLINE_DISPLAY}.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Los ZIP cercanos de ${stateName} aparecerán aquí a medida que se amplíe la cobertura.`,
  },
  neighborhood: {
    hooks: [
      (ctx) => ({
        headline: `Cerrajero cerca de ${ctx.city} ${ctx.zip} — clúster local de ZIP`,
        support: `${ctx.place} está anclado a códigos vecinos reales, no a un pie de página estatal. ${ctx.populationLabel}Use el clúster de esta página si está en el borde de ${ctx.zip}.`,
      }),
      (ctx) => ({
        headline: `Mapa de cobertura de cerrajero ${ctx.zip} en ${ctx.city}, ${ctx.stateId}`,
        support: `${ctx.densityCopy} Los listados adyacentes son el tablero real de ${ctx.stateId} para este rincón de ${countyLabel(ctx)}.`,
      }),
    ],
    intro: (ctx) => ({
      heading: `Guía de campo de ${ctx.place}`,
      paragraphs: [
        `${ctx.zip} es ${ctx.city}, ${ctx.stateId} — ${countyLabel(ctx)} — y ${ctx.populationLabel.toLowerCase()}El patrón local es ${ctx.densityLabel.toLowerCase()}: ${ctx.densityBand === "urban" ? "vivienda apilada, estacionamiento de paga y cierres de oficina nocturnos" : "calles unifamiliares, tardes de zona escolar y fallos de teclado de garage"}.`,
        `Esta página está hecha para esa geografía. Los ZIP vecinos se ordenan por distancia de este clúster, no como cadenas a lo largo de Texas. Los objetivos de respuesta se quedan cerca de ${ctx.responseTime}; las cotizaciones empiezan en ${ctx.priceRange}.`,
      ],
      checklistHeading: `Servicios que más piden los residentes de ${ctx.city} ${ctx.zip}`,
      localHeading: `Cobertura adyacente alrededor de ${ctx.zip}`,
      localBody: `Estos códigos son la malla local de ${ctx.place}. Quédese dentro de ${ctx.city} / ${countyLabel(ctx)} cuando pueda. Pasar a un ZIP vecino lo mantiene en el tablero de cerrajeros de este metro — no un volcado de Dallas en una página de Houston.`,
    }),
    aside: (ctx) => ({
      title: "Lectura del vecindario",
      body: ctx.densityCopy,
      metric: ctx.zip,
      metricLabel: "Este ZIP",
    }),
    chips: (ctx) => ({
      primaryLabel: "Zona",
      primaryValue: ctx.city,
      secondaryLabel: "Condado",
      secondaryValue: ctx.county === "the local" ? ctx.stateId : ctx.county,
    }),
    dps: (ctx) => ({
      heading: `Enrutamiento local sigue significando técnicos con licencia en ${ctx.city}`,
      body: `Un ZIP cercano no es un atajo alrededor de TX DPS. Las empresas que cubren ${ctx.zip} y su clúster siguen operando bajo el Capítulo 1702. Pida la licencia cuando llegue la camioneta.`,
    }),
    process: (ctx) => ({
      heading: `Cómo emparejamos ${ctx.zip} con un técnico cercano`,
      intro: `Primero la geografía: el cerrajero con licencia más cercano de este clúster, luego el estimado.`,
      steps: [
        {
          step: 1,
          title: "Confirme el código",
          detail: `Si está más cerca de un vecino listado en esta página, abra ese ZIP para que admisión no adivine en ${countyLabel(ctx)}.`,
        },
        {
          step: 2,
          title: "Empareje dentro del clúster",
          detail: `Preferimos un técnico que ya recorre este rincón ${ctx.densityLabel.toLowerCase()} antes que una cola estatal lejana.`,
        },
        {
          step: 3,
          title: "Despacho y estimado en sitio",
          detail: `Objetivo de llegada ${ctx.responseTime}. Usted aprueba el número antes del trabajo en ${ctx.place}.`,
        },
      ],
    }),
    checklist: [
      "Cierres residenciales 24/7 en ${city} ${zip}",
      "Cierres de cajuela y auto cerca de avenidas del condado de ${county}",
      "Corte de llave en sitio cuando se perdió la original",
      "Cambios de portón de HOA y buzón en este clúster",
      "Emparejado de cerradura inteligente después de un cierre",
      "Inspección de cerradura tras intento de robo",
    ],
    requiredFaqs: (ctx) => [
      {
        question: `¿Esta página de cerrajero es solo para el ZIP ${ctx.zip}?`,
        answer: `Está hecha para ${ctx.place}. Si está en el límite, use un código vecino de esta página — esos enlaces son ZIP cercanos reales, no una lista de todo Texas.`,
      },
      {
        question: `¿Un cerrajero de otro ZIP de ${ctx.city} igual viene a ${ctx.zip}?`,
        answer: `Sí, si es el más cercano disponible. El clúster de esta página comparte el tablero de ${ctx.stateId}. Aun así preferimos un técnico de ${countyLabel(ctx)} ya cerca de ${ctx.zip} para que el tiempo muerto no se coma la ventana de llegada.`,
      },
      {
        question: `¿En qué se diferencia ${ctx.zip} de una página estatal genérica de cerrajero?`,
        answer: `El texto, las FAQ y los enlaces vecinos están atados a ${ctx.city} ${ctx.zip} — ${ctx.densityLabel.toLowerCase()} en ${countyLabel(ctx)}, bandas de precio locales y códigos adyacentes ordenados por distancia.`,
      },
    ],
    extraFaqs: (ctx) => [
      {
        question: `¿Y si el GPS dice que no estoy en ${ctx.zip}?`,
        answer: `Abra el ZIP vecino de esta página que coincida con su pin. La admisión funciona mejor cuando el código coincide con la cuadra real en ${ctx.city}.`,
      },
      {
        question: `¿Cubren portones de HOA y departamentos en este clúster de ${ctx.city}?`,
        answer: `Sí. ${ctx.densityBand === "urban" ? "Garages en podio y entradas de media altura" : "HOA con portón y laterales de casa unifamiliar"} son comunes en ${ctx.zip}. Mencione los códigos de acceso en la llamada.`,
      },
      {
        question: `¿Qué tan rápido es un despacho de vecindario en ${ctx.zip}?`,
        answer: `El objetivo de llegada es ${ctx.responseTime} cuando un técnico ya está en este clúster. Cruzar todo el metro tarda más — por eso se listan los ZIP cercanos.`,
      },
      {
        question: `¿Puedo usar esta página si trabajo en ${ctx.city} pero vivo en un ZIP vecino?`,
        answer: `Use el ZIP donde está el cierre. La malla de esta página existe para que salte a ese código sin una búsqueda estatal.`,
      },
      {
        question: `¿Por qué algunos listados cercanos tienen otro nombre de ciudad que ${ctx.city}?`,
        answer: `Las etiquetas de ciudad de USPS y las líneas de condado no siempre coinciden. La distancia, no el string de ciudad, es lo que los colocó junto a ${ctx.zip}.`,
      },
    ],
    pricing: (ctx) => ({
      heading: `Rangos locales para el clúster ${ctx.zip}`,
      intro: `Banda de planificación ${ctx.priceRange} para este rincón ${ctx.densityLabel.toLowerCase()} de ${ctx.city}. Los ZIP vecinos conservan sus propias páginas.`,
    }),
    faqHeading: (ctx) => `Preguntas de vecindario para ${ctx.zip}`,
    faqLead: (ctx) =>
      `Respuestas de malla local para ${ctx.place}. Los ZIP cercanos de esta página están ordenados por distancia, no relleno estatal.`,
    meta: (ctx) =>
      `Cerrajero cerca de ${ctx.city} ${ctx.zip}. Clúster local de ${countyLabel(ctx)}, despacho ${ctx.responseTime}, típico ${ctx.priceRange}.`.slice(
        0,
        160,
      ),
    neighborsEmpty: (stateName) =>
      `Los ZIP cercanos de ${stateName} aparecerán aquí a medida que se amplíe la cobertura.`,
  },
};
