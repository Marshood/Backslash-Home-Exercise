export function findPaths(
  neighborsByNode: Map<string, string[]>,
  start: string,
  end: string
): string[][] {
  const results: string[][] = [];

  function visit(current: string, path: string[]): void {
    if (current === end) {
      results.push(path);
      return;
    }

    const neighbors = neighborsByNode.get(current) ?? [];

    for (const neighbor of neighbors) {
      // Prevent dublicated nodes
      if (path.includes(neighbor)) {
        continue;
      }

      visit(neighbor, [...path, neighbor]);
    }
  }

  visit(start, [start]);

  return results;
}