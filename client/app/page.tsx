"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraph, fetchRoutes } from "@/lib/api";
import { StatsBar } from "@/components/StatsBar";
import { FilterBar } from "@/components/FilterBar";
import { NodeTable } from "@/components/NodeTable";
import { NodeSidebar } from "@/components/NodeSidebar";
import type { GraphNode, RouteFilters } from "@/lib/types";

export default function Home() {
  const [filters, setFilters] = useState<RouteFilters>({
    startsPublic:     false,
    endsInSink:       false,
    hasVulnerability: false,
  });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { data: graph, isLoading, error } = useQuery({
    queryKey: ["graph"],
    queryFn:  fetchGraph,
  });

  const anyFilterActive = Object.values(filters).some(Boolean);

  const { data: routes } = useQuery({
    queryKey: ["routes", filters],
    queryFn:  () => fetchRoutes(filters),
    enabled:  anyFilterActive,
  });

  function toggleFilter(key: keyof RouteFilters) {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  }

  if (isLoading) return <div className="loading">Loading graph data…</div>;
  if (error)     return <div className="error">Failed to load graph. Is the server running on port 3003?</div>;

  return (
    <div className="app">
     

      <StatsBar nodes={graph?.nodes ?? []} routes={routes} />
      <FilterBar filters={filters} onToggle={toggleFilter} />

      <div className={`content${selectedNode ? " content-split" : ""}`}>
        <NodeTable
          nodes={anyFilterActive ? (routes?.nodes ?? []) : (graph?.nodes ?? [])}
          selectedNode={selectedNode}
          onSelect={setSelectedNode}
        />
        {selectedNode && (
          <NodeSidebar
            node={selectedNode}
            graph={graph}
            routes={routes}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>
    </div>
  );
}
