export type Edge = readonly [a: number, b: number, weight: number];

/** Dijkstra over an undirected weighted graph. Returns the settle order (for animation) and the path. */
export function shortestPath(size: number, edges: readonly Edge[], start: number, end: number) {
  if (start < 0 || end < 0 || start >= size || end >= size) throw new Error('Invalid node');
  const adjacency: [number, number][][] = Array.from({ length: size }, () => []);
  for (const [a, b, w] of edges) {
    adjacency[a].push([b, w]);
    adjacency[b].push([a, w]);
  }
  const distance = new Array<number>(size).fill(Infinity), parent = new Array<number>(size).fill(-1);
  const done = new Array<boolean>(size).fill(false), order: number[] = [];
  distance[start] = 0;
  // shortcut: O(n²) scan instead of a heap, fine for the ~100-node hero graph; use a heap past ~2k nodes.
  for (;;) {
    let current = -1;
    for (let n = 0; n < size; n++) if (!done[n] && distance[n] < Infinity && (current < 0 || distance[n] < distance[current])) current = n;
    if (current < 0) return { order, path: [] as number[], distance: Infinity };
    done[current] = true;
    order.push(current);
    if (current === end) break;
    for (const [next, w] of adjacency[current]) {
      if (distance[current] + w < distance[next]) {
        distance[next] = distance[current] + w;
        parent[next] = current;
      }
    }
  }
  const path: number[] = [];
  for (let n = end; n !== -1; n = parent[n]) path.unshift(n);
  return { order, path, distance: distance[end] };
}
