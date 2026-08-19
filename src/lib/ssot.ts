export const TARGET_STATES = [
  { rank: 1, id: "TX", name: "Texas", role: "pilot" },
  { rank: 2, id: "FL", name: "Florida", role: "expansion" },
  { rank: 3, id: "GA", name: "Georgia", role: "expansion" },
] as const;

export const SERVICE_PHASES = [
  {
    phase: 1,
    slug: "locksmith",
    name: "Emergency Locksmith",
    status: "active",
  },
  {
    phase: 2,
    slug: "plumbing",
    name: "Emergency Plumbing",
    status: "upcoming",
  },
  {
    phase: 3,
    slug: "water-damage",
    name: "Water Damage Restoration",
    status: "upcoming",
  },
] as const;

/** 완료 전까지 다음 주·다음 니치로 확장하지 않는다. */
export const CURRENT_PHASE = 1;

export type TargetStateId = (typeof TARGET_STATES)[number]["id"];
export type ServiceSlug = (typeof SERVICE_PHASES)[number]["slug"];

export function currentPhaseService() {
  const service = SERVICE_PHASES.find((item) => item.phase === CURRENT_PHASE);
  if (!service) {
    throw new Error(`No service defined for phase ${CURRENT_PHASE}`);
  }
  return service;
}

export function currentPhaseStateIds(): TargetStateId[] {
  if (CURRENT_PHASE === 1) {
    return TARGET_STATES.filter((state) => state.role === "pilot").map(
      (state) => state.id,
    );
  }

  return TARGET_STATES.map((state) => state.id);
}

export function isPhaseCoverage(serviceSlug: string, stateId: string) {
  const service = currentPhaseService();
  return (
    serviceSlug === service.slug &&
    currentPhaseStateIds().includes(stateId as TargetStateId)
  );
}

export function isPhaseService(serviceSlug: string) {
  return serviceSlug === currentPhaseService().slug;
}
