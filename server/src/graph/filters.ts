import type { GraphNode, RouteFilters } from "../data/type";

export function matchesFilters(
  path: string[],
  nodesByName: Map<string, GraphNode>,
  filters: RouteFilters
): boolean {
  const firstName = path[0];
  const lastName = path[path.length - 1];
  if (firstName === undefined || lastName === undefined) {
    return false;
  }

  const firstNode = nodesByName.get(firstName);
  const lastNode = nodesByName.get(lastName);

  if (
    filters.startsPublic &&
    firstNode?.publicExposed !== true
  ) {
    return false;
  }

  const isSink =
    lastNode?.kind === "rds" ||
    lastNode?.kind === "sql";

  if (filters.endsInSink && !isSink) {
    return false;
  }

  if (filters.hasVulnerability) {
    const hasVulnerability = path.some(name => {
      const node = nodesByName.get(name);

      return (node?.vulnerabilities?.length ?? 0) > 0;
    });

    if (!hasVulnerability) {
      return false;
    }
  }

  return true;
}