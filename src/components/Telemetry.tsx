'use client';

import { useEffect } from 'react';
import { initTelemetry } from '@/lib/telemetry';

export function Telemetry() {
  useEffect(() => {
    void initTelemetry();
  }, []);
  return null;
}
