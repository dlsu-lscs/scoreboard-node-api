// NOTE: Better‑Auth expects a **POST** request to the social sign‑in endpoint.
// The request body must contain the provider name and an optional callback URL.
// This helper builds the URL that the POST request should target.
export async function buildLoginUrl() {
  // Build a URL that the *browser* can open directly.
  // We cannot use the Better‑Auth POST endpoint here because a plain GET link would result in a 404.
  // Instead we point to a lightweight GET route (/api/auth/login) that renders a tiny HTML form
  // which auto‑submits a POST to Better‑Auth’s sign‑in/social endpoint.
  // This preserves the required cookie (state) and lets the flow work entirely in the browser.

  const baseUrl =
    process.env.BETTER_AUTH_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";
  const callbackUrl = encodeURIComponent(baseUrl + "/");
  return `${baseUrl}/api/auth/login?provider=google&callbackURL=${callbackUrl}`;
}

export async function buildLoginPage({
  provider = "google",
  callbackURL = "http://localhost:3000/",
}) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Redirecting…</title></head>
<body>
  <script>
    (async () => {
      const resp = await fetch('/api/auth/sign-in/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: '${provider}', callbackURL: '${callbackURL}' })
      });
      if (!resp.ok) {
        document.body.innerText = 'OAuth init failed: ' + resp.status;
        return;
      }
      const data = await resp.json();
      if (data.redirect && data.url) {
        window.location = data.url;
      } else {
        document.body.innerText = 'Unexpected response from auth server';
      }
    })();
  </script>
</body></html>`;
}
