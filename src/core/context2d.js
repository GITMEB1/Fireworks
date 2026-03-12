export function create2DContext(el) {
  const attempts = [
    { alpha: false, desynchronized: true, colorSpace: 'display-p3' },
    { alpha: false, desynchronized: true },
    { alpha: false }
  ];
  for (const opts of attempts) {
    try {
      const c = el.getContext('2d', opts);
      if (c) return c;
    } catch {
      // ignore and continue fallback attempts
    }
  }
  return el.getContext('2d');
}
