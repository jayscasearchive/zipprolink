import { ShieldCheck } from "lucide-react";

type TexasDpsNoticeProps = {
  heading: string;
  body: string;
};

export function TexasDpsNotice({ heading, body }: TexasDpsNoticeProps) {
  return (
    <section className="max-w-full overflow-x-hidden rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0 max-w-full">
          <h2 className="text-xl font-semibold tracking-tight wrap-break-word text-navy">
            {heading}
          </h2>
          <p className="mt-2 text-sm leading-6 wrap-break-word text-slate-700">
            {body}
          </p>
        </div>
      </div>
    </section>
  );
}
