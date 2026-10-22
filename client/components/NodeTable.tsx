import type { GraphNode } from "@/lib/types";

interface Props {
  nodes: GraphNode[];
  selectedNode: GraphNode | null;
  onSelect: (node: GraphNode) => void;
}

function highestSeverity(node: GraphNode): string | null {
  const sevs = node.vulnerabilities?.map(v => v.severity) ?? [];
  if (sevs.includes("high"))   return "high";
  if (sevs.includes("medium")) return "medium";
  if (sevs.includes("low"))    return "low";
  return null;
}

export function NodeTable({ nodes, selectedNode, onSelect }: Props) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Kind</th>
            <th>Public</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {nodes.map(node => {
            const severity   = highestSeverity(node);
            const isSelected = selectedNode?.name === node.name;

            return (
              <tr
                key={node.name}
                onClick={() => onSelect(node)}
                className={`row${isSelected ? " row-selected" : ""}`}
              >
                <td className="td-name">{node.name}</td>
                <td><span className={`badge badge-kind badge-kind-${node.kind}`}>{node.kind}</span></td>
                <td>
                  {node.publicExposed
                    ? <span className="badge badge-public">public</span>
                    : <span className="muted">—</span>
                  }
                </td>
                <td>
                  {severity
                    ? <span className={`badge badge-sev badge-${severity}`}>{severity}</span>
                    : <span className="muted">—</span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
