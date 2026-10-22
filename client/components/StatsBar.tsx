import type { GraphNode, RoutesResponse } from "@/lib/types";

interface Props {
  nodes: GraphNode[];
  routes: RoutesResponse | undefined;
}

export function StatsBar({ nodes, routes }: Props) {
  const publicCount = nodes.filter(n => n.publicExposed).length;
  const vulnCount = nodes.filter(n => (n.vulnerabilities?.length ?? 0) > 0).length;
  const highCount = nodes
    .flatMap(n => n.vulnerabilities ?? [])
    .filter(v => v.severity === "high").length;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-value">{nodes.length}</span>
        <span className="stat-label">Total Nodes</span>
      </div>
      <div className="stat-card stat-public">
        <span className="stat-value">{publicCount}</span>
        <span className="stat-label">Public Services</span>
      </div>
      <div className="stat-card stat-vuln">
        <span className="stat-value">{vulnCount}</span>
        <span className="stat-label">Vulnerable Services</span>
      </div>
      <div className="stat-card stat-high">
        <span className="stat-value">{highCount}</span>
        <span className="stat-label">High Severity</span>
      </div>
      <div className="stat-card stat-routes">
        <span className="stat-value">{routes?.paths.length ?? "—"}</span>
        <span className="stat-label">Matching Routes</span>
      </div>
    </div>
  );
}
