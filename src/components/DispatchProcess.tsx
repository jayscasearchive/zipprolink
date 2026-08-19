import { ClipboardList, MapPinned, PhoneCall } from "lucide-react";
import type { DispatchStep } from "@/lib/variation/types";

const ICONS = [PhoneCall, MapPinned, ClipboardList];

type DispatchProcessProps = {
  heading: string;
  intro: string;
  steps: DispatchStep[];
};

export function DispatchProcess({ heading, intro, steps }: DispatchProcessProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight text-navy">{heading}</h2>
      <p className="mt-2 mb-8 text-sm leading-6 text-slate-600">{intro}</p>
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((item, index) => {
          const Icon = ICONS[index] ?? PhoneCall;
          return (
            <li
              key={item.step}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
                {item.step}
              </span>
              <div className="mt-2 flex items-start gap-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emergency" aria-hidden />
                <div>
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
