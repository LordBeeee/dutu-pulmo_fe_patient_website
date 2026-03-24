export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  AI_WEBHOOK_URL: import.meta.env.VITE_AI_WEBHOOK_URL || "",
  API_TIMEOUT_MS: Number(import.meta.env.VITE_API_TIMEOUT_MS || 30000),
} as const;
