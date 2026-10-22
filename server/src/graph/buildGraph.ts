import type { GraphData, GraphNode } from "../data/type";

export function buildGraph(data: GraphData) {
  const nodesByName = data.nodes.reduce((map, node) => {
    map.set(node.name, node);
    return map;
  }, new Map<string, GraphNode>());

  const initialNeighborsByNode = new Map<string, string[]>(
    data.nodes.map(node => [node.name, []])
  );

  const neighborsByNode = data.edges.reduce((map, edge) => {
    const targets = Array.isArray(edge.to) ? edge.to : [edge.to];
    const neighbors = map.get(edge.from) ?? [];
    neighbors.push(...targets);
    map.set(edge.from, neighbors);
    return map;
  }, initialNeighborsByNode);

  return { nodesByName, neighborsByNode };
}
