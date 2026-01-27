// Basic auth middleware for Cloudflare Pages
// Remove this file when ready to go live

const CREDENTIALS = {
  username: 'nichessp',
  password: 'salary2026'
};

export async function onRequest(context) {
  const authorization = context.request.headers.get('Authorization');

  if (authorization) {
    const [scheme, encoded] = authorization.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
        return context.next();
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="NicheSSP Salary Survey Preview"',
    },
  });
}
