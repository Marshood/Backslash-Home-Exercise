import { Router } from "express";
import type { GraphData, RouteFilters } from "../data/type.js";
import { buildGraph } from "../graph/buildGraph.js";
import { findFilteredPaths } from "../graph/findFilteredPaths.js";

const KNOWN_FILTERS = new Set(["startsPublic", "endsInSink", "hasVulnerability"]);

export function createGraphRouter(data: GraphData) {
  const router = Router();
  const graph = buildGraph(data);

  router.get("/", (_req, res) => {
    res.json(data);
  });

  router.get("/routes", (req, res) => {
    for (const key of Object.keys(req.query)) {
      if (!KNOWN_FILTERS.has(key)) {
        res.status(400).json({ error: `Unknown filter: ${key}` });
        return;
      }
      if (req.query[key] !== "true" && req.query[key] !== "false") {
        res.status(400).json({ error: `${key} must be "true" or "false"` });
        return;
      }
    }

    const filters: RouteFilters = {
      startsPublic:     req.query.startsPublic     === "true",
      endsInSink:       req.query.endsInSink       === "true",
      hasVulnerability: req.query.hasVulnerability === "true",
    };

    const paths = findFilteredPaths(
      graph.nodesByName,
      graph.neighborsByNode,
      filters,
    );

    const nodeNames = new Set<string>();
    for (const path of paths) {
      for (const name of path) {
        nodeNames.add(name);
      }
    }

    const nodes = [...nodeNames].map(name => graph.nodesByName.get(name)!);

    res.json({ nodes, paths });
  });

  return router;
}
