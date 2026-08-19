import type { JobEstimate } from "@/lib/variation/types";

type PriceTimeTableProps = {
  heading: string;
  intro?: string;
  rows: JobEstimate[];
  tone?: "light" | "hero";
};

export function PriceTimeTable({
  heading,
  intro,
  rows,
  tone = "light",
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
            ? "overflow-x-auto rounded-2xl border border-white/15 bg-white shadow-lg"
            : "overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"
        }
      >
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Cost range</th>
              <th className="px-4 py-3 font-semibold">Dispatch time</th>
              <th className="hidden px-4 py-3 font-semibold sm:table-cell">
                Local note
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
        Ranges are estimates for this ZIP. The technician confirms the quote
        on site before any work begins.
      </p>
    </section>
  );
}
