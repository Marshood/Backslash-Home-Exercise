import type { GraphData } from "./type.js";
import data from "../../data/train-ticket-be.json";

function validateGraphData(data: unknown): void {
  if (typeof data !== "object" || data === null) {
    throw new Error("Graph data must be an object");
  }

  if (
    !("nodes" in data) ||
    !Array.isArray(data.nodes) ||
    !("edges" in data) ||
    !Array.isArray(data.edges)
  ) {
    throw new Error("Graph data must contain nodes and edges arrays");
  }
}

export function loadData(): GraphData {
  validateGraphData(data);
  return data;
}
