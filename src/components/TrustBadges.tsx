import { BadgeCheck, FileCheck2, Shield, Wallet } from "lucide-react";

const BADGES = [
  { label: "Licensed", icon: BadgeCheck },
  { label: "Insured", icon: Shield },
  { label: "Upfront Estimates", icon: FileCheck2 },
  { label: "No Hidden Fees", icon: Wallet },
];

export function TrustBadges() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {BADGES.map(({ label, icon: Icon }) => (
        <li
          key={label}
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-navy shadow-sm"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
