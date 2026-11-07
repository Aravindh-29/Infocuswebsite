export const dynamic = "force-static";
import { vendors } from "@/lib/vendors";
import type { MetadataRoute } from "next";
import { solutions, services } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "solutions",
    "industries",
    "platforms",
    "services",
    "about",
    "careers",
    "contact",
    "privacy",
    ...solutions.map((s) => "solutions/" + s.slug),
    ...vendors.map((v) => "platforms/" + v.slug),
    ...services.map((s) => "services/" + s.slug),
  ].map((path) => ({
    url: "https://www.infocuscs.com/" + path,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
