export function buildLoginUrl() {
  const baseUrl =
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";
  const callbackUrl = encodeURIComponent(baseUrl + "/");
  return `${baseUrl}/api/auth/sign-in/social?provider=google&callbackURL=${callbackUrl}`;
}