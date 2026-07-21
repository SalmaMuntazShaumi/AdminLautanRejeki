// File: src/hooks/useRealtime.js
// Hook untuk polling data secara real-time dari API

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook untuk polling data secara berkala (pseudo real-time)
 *
 * @param {Function} fetchFn    - Fungsi async yang memanggil API
 * @param {object}   options
 * @param {number}   options.interval    - Interval polling dalam ms (default: 30000 = 30 detik)
 * @param {boolean}  options.immediate   - Fetch langsung saat mount (default: true)
 * @param {boolean}  options.enabled     - Aktifkan/nonaktifkan polling (default: true)
 * @param {Array}    options.deps        - Dependencies tambahan untuk trigger re-fetch
 *
 * @example
 * const { data, loading, error, refetch } = useRealtime(
 *   () => getAbsensi({ tanggal: today }),
 *   { interval: 15000 }
 * );
 */
export const useRealtime = (fetchFn, options = {}) => {
  const {
    interval = 30000,
    immediate = true,
    enabled = true,
    deps = [],
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate && enabled);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setError(null);
      const response = await fetchFn();
      if (isMountedRef.current) {
        setData(response.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Gagal memuat data');
        console.error('useRealtime fetch error:', err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFn, enabled, ...deps]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!enabled) {
      setLoading(false);
      return;
    }

    if (immediate) {
      setLoading(true);
      fetch();
    }

    // Set up interval polling
    intervalRef.current = setInterval(fetch, interval);

    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, immediate, interval, fetch]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetch,
  };
};

/**
 * Hook khusus untuk status absensi hari ini (polling cepat: 15 detik)
 */
export const useAbsensiRealtime = (params = {}) => {
  const { getAbsensi } = require('../api/absensi'); // lazy import
  return useRealtime(() => getAbsensi({ ...params, per_page: 100 }), {
    interval: 15000,
  });
};