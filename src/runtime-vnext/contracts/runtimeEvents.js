/**
 * Lightweight runtime event stream for vNext seam hardening.
 * Intentionally small for Phase 0; can be swapped with fuller bus later.
 */
export function createRuntimeEvents() {
  const subscribers = new Map();

  function on(type, handler) {
    if (!subscribers.has(type)) subscribers.set(type, new Set());
    subscribers.get(type).add(handler);
    return () => subscribers.get(type)?.delete(handler);
  }

  function emit(type, payload = {}) {
    const handlers = subscribers.get(type);
    if (!handlers || handlers.size === 0) return;
    for (const handler of handlers) handler(payload);
  }

  return { on, emit };
}
