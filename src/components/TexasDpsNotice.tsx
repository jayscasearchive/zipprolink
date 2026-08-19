import { ShieldCheck } from "lucide-react";

type TexasDpsNoticeProps = {
  heading: string;
  body: string;
};

export function TexasDpsNotice({ heading, body }: TexasDpsNoticeProps) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-navy">{heading}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
        </div>
      </div>
    </section>
  );
}
