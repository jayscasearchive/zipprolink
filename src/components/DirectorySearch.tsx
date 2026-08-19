"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getDictionary, type AppLocale } from "@/lib/i18n";
import { directoryPath } from "@/lib/paths";
import { currentPhaseService } from "@/lib/ssot";

type DirectorySearchProps = {
  locale: AppLocale;
  services: { slug: string; name: string }[];
  defaultService?: string;
  variant?: "hero" | "compact";
};

export function DirectorySearch({
  locale,
  services,
  defaultService,
  variant = "hero",
}: DirectorySearchProps) {
  const router = useRouter();
  const copy = getDictionary(locale);
  const [service, setService] = useState(
    defaultService ?? services[0]?.slug ?? currentPhaseService().slug,
  );
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zip.trim();

    if (!/^\d{5}$/.test(normalized)) {
      setError(copy.searchError);
      return;
    }

    setError("");
    setPending(true);

    try {
      const response = await fetch(
        `/api/directory/lookup?zip=${normalized}&service=${encodeURIComponent(service)}`,
      );
      if (!response.ok) {
        setError(copy.searchError);
        return;
      }
      const data = (await response.json()) as {
        service: string;
        state: string;
        city: string;
        zip: string;
      };
      router.push(
        directoryPath({
          locale,
          service: data.service,
          state: data.state,
          city: data.city,
          zip: data.zip,
        }),
      );
    } catch {
      setError(copy.searchError);
    } finally {
      setPending(false);
    }
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={onSubmit}
      className={
        isHero
          ? "w-full rounded-2xl bg-white p-3 shadow-xl shadow-navy/15 ring-1 ring-black/5 sm:p-4"
          : "w-full rounded-xl border border-slate-200 bg-white p-3"
      }
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        {services.length > 1 ? (
          <>
            <label className="sr-only" htmlFor="service-select">
              Service
            </label>
            <select
              id="service-select"
              value={service}
              onChange={(event) => setService(event.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-navy outline-none ring-emergency/30 focus:border-emergency focus:bg-white focus:ring-2 sm:w-48"
            >
              {services.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name.replace("Emergency ", "").replace(" Service", "")}
                </option>
              ))}
            </select>
          </>
        ) : (
          <input type="hidden" name="service" value={service} />
        )}

        <label className="sr-only" htmlFor="zip-input">
          ZIP code
        </label>
        <input
          id="zip-input"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder={copy.searchPlaceholder}
          value={zip}
          onChange={(event) => {
            setZip(event.target.value.replace(/\D/g, "").slice(0, 5));
            if (error) setError("");
          }}
          className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-navy outline-none ring-emergency/30 placeholder:text-slate-400 focus:border-emergency focus:bg-white focus:ring-2"
        />

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-emergency px-5 text-sm font-semibold text-white transition hover:bg-emergency-dark disabled:opacity-70"
        >
          <Search className="h-4 w-4" aria-hidden />
          {copy.searchButton}
        </button>
      </div>
      {error ? (
        <p className="mt-2 px-1 text-sm text-emergency" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
