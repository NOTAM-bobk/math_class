import posthog from "posthog-js";

const posthogKey = process.env.PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.PUBLIC_POSTHOG_HOST;
const isProduction = process.env.NODE_ENV === "production";

function reportMissingConfiguration(variableName: string) {
  if (!isProduction && typeof window !== "undefined") {
    throw new Error(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    );
  }
}

if (!posthogKey) {
  reportMissingConfiguration("PUBLIC_POSTHOG_KEY");
} else if (!posthogHost) {
  reportMissingConfiguration("PUBLIC_POSTHOG_HOST");
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2026-08-30",
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
      capture_console_errors: false,
    },
    logs: {
      serviceName: "polytrack-hub-web",
      environment: isProduction ? "production" : "development",
    },
  });
}

export { posthog };
