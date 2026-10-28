import { redirect } from "next/navigation";

const one = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] ?? "" : value ?? "";

/** Retain old archive links while the top page owns the complete archive. */
export default async function ArchivePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const source = await searchParams;
  const target = new URLSearchParams({ year: one(source.year) || "all" });
  if (one(source.team)) target.set("team", one(source.team));
  if (one(source.q)) target.set("q", one(source.q).slice(0, 200));
  redirect(`/?${target}#works`);
}
