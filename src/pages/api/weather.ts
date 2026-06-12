import type { APIRoute } from 'astro';

export const prerender = false;

// wttr.in one-liner for Chiang Mai, e.g. "🌦 +26°C" (%c = condition, %t = temp)
const WTTR_URL = 'https://wttr.in/Chiang+Mai?format=%c+%t';

export const GET: APIRoute = async () => {
  try {
    const r = await fetch(WTTR_URL, { headers: { 'User-Agent': 'curl/8' } });
    const text = (await r.text()).trim();
    // wttr.in returns HTML error pages on failure — accept only the short one-liner
    const weather = r.ok && text.length > 0 && text.length < 40 && !text.includes('<') ? text : null;

    return new Response(JSON.stringify({ weather }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=600, stale-while-revalidate=3600',
      },
    });
  } catch {
    return new Response(JSON.stringify({ weather: null, error: 'fetch_failed' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
