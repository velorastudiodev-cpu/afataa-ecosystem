import test from 'node:test';
import assert from 'node:assert/strict';
import { shortestPath } from '../apps/portfolio/src/lib/graph';

test('weighted Dijkstra prefers the cheaper detour', () => {
  // 0-1 costs 10 directly, 0-2-1 costs 3.
  const r = shortestPath(3, [[0, 1, 10], [0, 2, 1], [2, 1, 2]], 0, 1);
  assert.deepEqual(r.path, [0, 2, 1]);
  assert.equal(r.distance, 3);
  assert.equal(r.order.at(-1), 1);
});

test('disconnected target returns no path', () => {
  const r = shortestPath(4, [[0, 1, 1], [2, 3, 1]], 0, 3);
  assert.deepEqual(r.path, []);
  assert.equal(r.distance, Infinity);
});

test('rejects out-of-range nodes', () => {
  assert.throws(() => shortestPath(2, [], 0, 5));
});
