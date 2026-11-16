'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to safely consume persisted Zustand stores without hydration mismatch warnings.
 * Returns the fallback value on server and initial render, then updates to store state after mounting.
 *
 * @param {Function} store - The zustand store hook (e.g. useCartStore)
 * @param {Function} callback - Selector callback (e.g. state => state.items)
 * @param {*} fallback - Initial SSR fallback value (e.g. [] or 0)
 */
export function useStore(store, callback, fallback = undefined) {
  const result = store(callback);
  const [data, setData] = useState(fallback);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
}

export default useStore;
