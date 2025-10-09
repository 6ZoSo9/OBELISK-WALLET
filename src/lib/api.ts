export const API_BASE = import.meta.env.VITE_RELAYER_URL || '';

export async function getHealth() {
  const r = await fetch(`${API_BASE}/health`);
  return r.json();
}

export async function getGas() {
  const r = await fetch(`${API_BASE}/gas`);
  return r.json();
}

export async function sponsorQuote(to: string, data: string) {
  const r = await fetch(`${API_BASE}/sponsor`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mode: 'quote', to, data }),
  });
  return r.json();
}

export async function sponsorExecute(to: string, data: string) {
  const r = await fetch(`${API_BASE}/sponsor`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mode: 'execute', to, data }),
  });
  return r.json();
}
