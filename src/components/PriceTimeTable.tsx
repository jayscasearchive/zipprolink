import type { JobEstimate, PricingTableLabels } from "@/lib/variation/types";
import { PRICING_TABLE_EN } from "@/lib/variation/pools";

type PriceTimeTableProps = {
  heading: string;
  intro?: string;
  rows: JobEstimate[];
  tone?: "light" | "hero";
  labels?: PricingTableLabels;
};

export function PriceTimeTable({
  heading,
  intro,
  rows,
  tone = "light",
  labels = PRICING_TABLE_EN,
}: PriceTimeTableProps) {
  const isHero = tone === "hero";

  return (
    <section>
      <h2
        className={
          isHero
            ? "text-lg font-semibold tracking-tight text-white sm:text-xl"
            : "text-2xl font-semibold tracking-tight text-navy"
        }
      >
        {heading}
      </h2>
      {intro ? (
        <p
          className={
            isHero
              ? "mt-2 mb-4 text-sm leading-6 text-white/70"
              : "mt-2 mb-6 text-sm leading-6 text-slate-600"
          }
        >
          {intro}
        </p>
      ) : null}
      <div
        className={
          isHero
            ? "max-w-full overflow-x-auto rounded-2xl border border-white/15 bg-white shadow-lg"
            : "max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
        }
      >
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">{labels.service}</th>
              <th className="px-4 py-3 font-semibold">{labels.cost}</th>
              <th className="px-4 py-3 font-semibold">{labels.dispatch}</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                {labels.note}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.job} className="border-t border-slate-200">
                <td className="px-4 py-3 font-semibold text-navy">{row.job}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{row.price}</td>
                <td className="px-4 py-3 text-slate-700">{row.time}</td>
                <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        className={
          isHero
            ? "mt-3 text-xs text-white/55"
            : "mt-3 text-xs text-slate-500"
        }
      >
        {labels.disclaimer}
      </p>
    </section>
  );
}
