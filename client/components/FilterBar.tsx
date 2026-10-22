import type { RouteFilters } from "@/lib/types";

interface Props {
  filters: RouteFilters;
  onToggle: (key: keyof RouteFilters) => void;
}

const FILTERS: { key: keyof RouteFilters; label: string }[] = [
  { key: "startsPublic",     label: "Starts Public"     },
  { key: "endsInSink",       label: "Ends in Sink"       },
  { key: "hasVulnerability", label: "Has Vulnerability"  },
];

export function FilterBar({ filters, onToggle }: Props) {
  return (
    <div className="filter-bar">
      <span className="filter-label">Filters</span>
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onToggle(key)}
          className={`filter-btn${filters[key] ? " filter-btn-active" : ""}`}
        >
          {filters[key] && <span className="filter-check">✓ </span>}
          {label}
        </button>
      ))}
    </div>
  );
}
