// Anonymous, device-scoped session telemetry for v0.1.
//
// Sink: PostHog Cloud (US region) — free tier. Configured via NEXT_PUBLIC_POSTHOG_KEY.
// When the key is missing (e.g. local dev without secrets), track() becomes a no-op
// that logs to the console so callsites stay easy to verify.
//
// Privacy stance: no accounts, no identified profiles, no IPs forwarded by us
// (PostHog project itself is set to discard client IPs — see EXM-6 runbook).

const DEVICE_ID_STORAGE_KEY = 'exm_device_id';
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

export type TelemetryEvent =
  | 'topic_select_viewed'
  | 'session_start'
  | 'question_answered'
  | 'session_complete'
  | 'session_retry'
  | 'session_abandoned';

export type TelemetryProperties = Record<string, string | number | boolean | null | undefined>;

let initialized = false;
let initPromise: Promise<void> | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getDeviceId(): string {
  if (!isBrowser()) return 'server';
  try {
    const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (existing) return existing;
    const fresh =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // localStorage blocked (private mode, etc) — fall back to a per-page ephemeral id.
    return `ephemeral-${Math.random().toString(36).slice(2, 10)}`;
  }
}

async function loadPostHog() {
  const mod = await import('posthog-js');
  return mod.default;
}

export async function initTelemetry(): Promise<void> {
  if (!isBrowser()) return;
  if (initialized) return;
  if (initPromise) return initPromise;
  if (!POSTHOG_KEY) return;

  initPromise = (async () => {
    const posthog = await loadPostHog();
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      disable_session_recording: true,
      disable_surveys: true,
      person_profiles: 'identified_only',
      bootstrap: {
        distinctID: getDeviceId(),
        isIdentifiedID: false,
      },
      loaded: (instance) => {
        // Defensive: scrub IP from any future event before send.
        instance.register({ $ip: null });
      },
    });
    initialized = true;
  })();

  return initPromise;
}

export function track(event: TelemetryEvent, properties: TelemetryProperties = {}): void {
  if (!isBrowser()) return;
  const payload = { ...properties, device_id: getDeviceId() };

  if (!POSTHOG_KEY) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[telemetry:noop]', event, payload);
    }
    return;
  }

  void (async () => {
    try {
      await initTelemetry();
      const posthog = await loadPostHog();
      posthog.capture(event, payload);
    } catch {
      // Telemetry must never crash the app.
    }
  })();
}
