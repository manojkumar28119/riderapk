export const COOKIE_KEYS = {
  TOKEN: "auth_token",
  USER: "auth_user",
  REFRESH_TOKEN: "refresh_token",
  SESSIONID: "session_id",
  EXPIRES_AT: "expires_at",
};

export const DEFAULT_COOKIE_OPTIONS = {
  expires: 7, // default 7 days
  path: "/",
  secure: process.env.NODE_ENV === "production", // only HTTPS in prod
  sameSite: "strict" as const, // better security
};
