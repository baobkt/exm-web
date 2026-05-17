'use client';

import { useEffect } from 'react';
import { track } from '@/lib/telemetry';

export function TopicSelectTelemetry({ topicCount }: { topicCount: number }) {
  useEffect(() => {
    track('topic_select_viewed', { topic_count: topicCount });
  }, [topicCount]);
  return null;
}
