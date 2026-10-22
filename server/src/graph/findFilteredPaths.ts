import type { GraphNode, RouteFilters } from "../data/type";
import { matchesFilters } from "./filters";

export function findFilteredPaths(
  nodesByName: Map<string, GraphNode>,
  neighborsByNode: Map<string, string[]>,
  filters: RouteFilters,
): string[][] {
  const results: string[][] = [];

  function visit(current: string, path: string[]): void {
    const neighbors = neighborsByNode.get(current) ?? [];
    const unvisited = neighbors.filter(n => !path.includes(n) && nodesByName.has(n));

    if (path.length > 1 && unvisited.length === 0) {
      if (matchesFilters(path, nodesByName, filters)) {
        results.push(path);
      }
      return;
    }

    for (const neighbor of unvisited) {
      visit(neighbor, [...path, neighbor]);
    }
  }

  for (const node of nodesByName.values()) {
   
    if (filters.startsPublic && node.publicExposed !== true) {
      continue;
    }

    // Skip isolated nodes 
    if ((neighborsByNode.get(node.name) ?? []).length === 0) {
      continue;
    }

    visit(node.name, [node.name]);
  }

  return results;
}