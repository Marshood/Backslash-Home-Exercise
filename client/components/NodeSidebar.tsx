import type { GraphNode, GraphData, RoutesResponse } from "@/lib/types";

interface Props {
  node: GraphNode;
  graph: GraphData | undefined;
  routes: RoutesResponse | undefined;
  onClose: () => void;
}

export function NodeSidebar({ node, graph, routes, onClose }: Props) {
  const calls = graph?.edges
    .filter(e => e.from === node.name)
    .flatMap(e => (Array.isArray(e.to) ? e.to : [e.to])) ?? [];

  const calledBy = graph?.edges
    .filter(e => {
      const targets = Array.isArray(e.to) ? e.to : [e.to];
      return targets.includes(node.name);
    })
    .map(e => e.from) ?? [];

  const filtersActive = routes !== undefined;
  const paths = routes?.paths.filter(p => p.includes(node.name)) ?? [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">{node.name}</h2>
        <button onClick={onClose} className="close-btn" aria-label="Close">✕</button>
      </div>

      <div className="sidebar-body">

        <section className="sidebar-section">
          <h3 className="section-title">Details</h3>
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Kind</dt>
              <dd><span className={`badge badge-kind badge-kind-${node.kind}`}>{node.kind}</span></dd>
            </div>
            {node.language && (
              <div className="detail-row">
                <dt>Language</dt>
                <dd>{node.language}</dd>
              </div>
            )}
            {node.path && (
              <div className="detail-row">
                <dt>Path</dt>
                <dd className="mono">{node.path}</dd>
              </div>
            )}
            <div className="detail-row">
              <dt>Public Exposed</dt>
              <dd>
                {node.publicExposed
                  ? <span className="badge badge-public">Yes</span>
                  : <span className="muted">No</span>
                }
              </dd>
            </div>
            {node.metadata && Object.entries(node.metadata).map(([k, v]) => (
              <div className="detail-row" key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {(node.vulnerabilities?.length ?? 0) > 0 && (
          <section className="sidebar-section">
            <h3 className="section-title">
              Vulnerabilities
              <span className="count-badge">{node.vulnerabilities!.length}</span>
            </h3>
            {node.vulnerabilities!.map((v, i) => (
              <div key={i} className={`vuln-card vuln-${v.severity}`}>
                <div className="vuln-header">
                  <span className={`badge badge-sev badge-${v.severity}`}>{v.severity}</span>
                  <span className="vuln-cwe">{v.metadata.cwe}</span>
                </div>
                <p className="vuln-msg">{v.message}</p>
                <p className="vuln-file mono">{v.file}</p>
              </div>
            ))}
          </section>
        )}

        <section className="sidebar-section">
          <h3 className="section-title">
            Calls
            <span className="count-badge">{calls.length}</span>
          </h3>
          {calls.length === 0 ? (
            <p className="empty">No outgoing calls</p>
          ) : (
            <ul className="node-list">
              {calls.map(name => <li key={name}>{name}</li>)}
            </ul>
          )}
        </section>

        <section className="sidebar-section">
          <h3 className="section-title">
            Called By
            <span className="count-badge">{calledBy.length}</span>
          </h3>
          {calledBy.length === 0 ? (
            <p className="empty">Not called by any service</p>
          ) : (
            <ul className="node-list">
              {calledBy.map(name => <li key={name}>{name}</li>)}
            </ul>
          )}
        </section>

        <section className="sidebar-section">
          <h3 className="section-title">
            Paths
            <span className="count-badge">{paths.length}</span>
          </h3>
          {!filtersActive ? (
            <p className="empty">Enable a filter above to see matching paths</p>
          ) : paths.length === 0 ? (
            <p className="empty">This node is not part of any matching route</p>
          ) : (
            <ul className="path-list">
              {paths.map((path, i) => (
                <li key={i} className="path-item">
                  {path.map((name, j) => (
                    <span key={j}>
                      <span className={name === node.name ? "path-node path-node-hl" : "path-node"}>
                        {name}
                      </span>
                      {j < path.length - 1 && <span className="path-arrow">→</span>}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </aside>
  );
}
