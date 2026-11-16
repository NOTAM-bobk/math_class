import { LAST_UPDATED_ISO } from "./buildInfo";

/** Human-readable build stamp shown in the footer and at the bottom of Settings. */
export function formatLastUpdated(): string {
  const date = new Date(LAST_UPDATED_ISO);
  if (Number.isNaN(date.getTime())) return LAST_UPDATED_ISO;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export { LAST_UPDATED_ISO };
