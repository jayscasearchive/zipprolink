import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emergency">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy">
          Page not found
        </h1>
        <p className="mt-3 text-slate-600">
          That directory URL does not exist. Search from the homepage or try a
          test city ZIP.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-emergency px-5 text-sm font-semibold text-white hover:bg-emergency-dark"
        >
          Back to ZipProLink
        </Link>
      </main>
    </div>
  );
}
