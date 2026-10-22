import type { GraphData, RouteFilters, RoutesResponse } from "./types";

const BASE = "/api";

export async function fetchGraph(): Promise<GraphData> {
  const res = await fetch(`${BASE}/graph`);
  if (!res.ok) throw new Error("Failed to fetch graph");
  return res.json();
}

export async function fetchRoutes(filters: RouteFilters): Promise<RoutesResponse> {
  const params = new URLSearchParams();
  if (filters.startsPublic) params.set("startsPublic", "true");
  if (filters.endsInSink) params.set("endsInSink", "true");
  if (filters.hasVulnerability) params.set("hasVulnerability", "true");
  const res = await fetch(`${BASE}/graph/routes?${params}`);
  if (!res.ok) throw new Error("Failed to fetch routes");
  return res.json();
}
