# Backslash Home Exercise

## My Process

The first thing I did was open the JSON file and spend time understanding its structure — what a node looks like, what fields it has, how edges connect nodes, and what the different `kind` values mean (service, rds, sqs, etc.). I wanted to have a clear mental model of the data before writing a single line of code.

After that I re-read the requirements carefully and broke them down into concrete questions: what does "route" mean here? what counts as a sink? how should multiple filters combine? Answering those questions upfront saved a lot of back-and-forth later.

Once I understood the problem I did some research on the right traversal algorithm. The classic approach for finding all paths in a directed graph is depth-first search with cycle prevention, and it maps naturally to what the requirements ask for — complete call chains from a start node to a terminal node. I went with that.

For implementation I wrote the core logic (graph building, DFS, filter predicates) myself, then used AI assistance to clean up the code structure, sharpen the TypeScript types, and handle the UI styling and component wiring on the frontend. The algorithms and design decisions are mine; AI helped me express them cleanly.

---

## How to Run

**Backend**
```bash
cd server
npm install
npm run dev        # development (tsx watch, port 3003)
npm run build      # compile to dist/
npm start          # run compiled output
```

**Frontend**
```bash
cd client
npm install
npm run dev        # Next.js dev server, port 3000
```

Open http://localhost:3000. The frontend proxies `/api` requests to the backend on port 3003.

---

## API Endpoints

### `GET /graph`
Returns the full raw graph (all nodes and edges).

### `GET /graph/routes`
Returns filtered routes through the graph.

**Query parameters** (all optional, default `false`):

| Parameter | Description |
|---|---|
| `startsPublic=true` | Only routes that start from a node with `publicExposed: true` |
| `endsInSink=true` | Only routes that end at a sink node (`kind: rds` or `kind: sql`) |
| `hasVulnerability=true` | Only routes that pass through at least one node with vulnerabilities |

Filters combine as AND — all enabled filters must match.

**Response shape:**
```json
{
  "nodes": [...],
  "paths": [["service-a", "service-b", "prod-postgresdb"], ...]
}
```

`nodes` contains only the services involved in matching paths. `paths` contains the explicit ordered call chains.

---

## Architecture

### 1. Graph Building (`buildGraph.ts`)

The JSON data is loaded once at startup and converted into two `Map` structures:

- `nodesByName: Map<string, GraphNode>` — O(1) node lookup by name
- `neighborsByNode: Map<string, string[]>` — adjacency list for DFS traversal

Edges in the source data use `to: string | string[]`, so multi-target edges are normalised into individual neighbour entries.

### 2. Route Discovery — DFS (`findFilteredPaths.ts`)

Routes are found via a depth-first search starting from every node in the graph (or only public nodes when `startsPublic` is enabled).

Key decisions:

- **Complete paths only** — a path is only recorded when the DFS reaches a dead end (no more unvisited neighbours). This ensures results represent full call chains, not intermediate sub-paths.
- **Cycle prevention** — each DFS branch tracks visited nodes so a node cannot appear twice in the same path.
- **Isolated node skip** — nodes with no outgoing edges are skipped before the DFS starts, avoiding pointless traversals.

### 3. Filter System (`filters.ts`)

Filters are evaluated on a complete path in a single `matchesFilters` function:

```
matchesFilters(path, nodesByName, filters) → boolean
```

Each filter is an independent predicate:

| Filter | Logic |
|---|---|
| `startsPublic` | `path[0].publicExposed === true` |
| `endsInSink` | `path[last].kind === "rds"` or `"sql"` |
| `hasVulnerability` | any node in path has `vulnerabilities.length > 0` |

**Adding a new filter** requires two small changes:
1. Add the field to the `RouteFilters` interface in `type.ts`
2. Add one predicate block in `filters.ts`

No changes needed to the DFS, the router, or the response shape.

### 4. Input Validation (`routes/graph.ts`)

The `/routes` handler validates all query parameters before processing:
- Unknown parameters → `400 Unknown filter: <key>`
- Non-boolean values → `400 <key> must be "true" or "false"`


