export interface Vulnerability {
  file: string;
  severity: string;
  message: string;
  metadata: {
    cwe: string;
  };
}

export  interface GraphNode {
  name: string;
  kind: string;
  publicExposed?: boolean;
  vulnerabilities?: Vulnerability[];
}

export interface GraphEdge {
  from: string;
  to: string | string[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
export interface RouteFilters {
  startsPublic?: boolean;
  endsInSink?: boolean;
  hasVulnerability?: boolean;
}