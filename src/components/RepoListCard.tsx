import { useEffect, useState } from 'react';

type Repo = {
  id: number;
  name: string;
  metadataURI: string;
  maintainer: string;
  escrow: string;
  exists: boolean;
};

const API_BASE = import.meta.env.VITE_RELAYER_URL || '';

export default function RepoListCard() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/repos`).then(res => res.json());
        setRepos(r.repos || []);
      } catch (e: any) {
        setError(e?.message ?? 'failed to load repos');
      }
    })();
  }, []);

  return (
    <div className="border border-white/10 rounded-2xl p-4 bg-white/5">
      <div className="text-sm opacity-80 mb-2">Repositories</div>
      {error && <div className="text-xs text-red-300 mb-2">{error}</div>}
      {!repos && <div className="text-sm opacity-70">Loading…</div>}
      {repos && repos.length === 0 && <div className="text-sm opacity-70">No repos found</div>}
      {repos && repos.length > 0 && (
        <ul className="space-y-2">
          {repos.map(r => (
            <li key={r.id} className="border border-white/10 rounded-xl p-3">
              <div className="text-sm font-medium">{r.name} <span className="opacity-60">#{r.id}</span></div>
              <div className="text-xs opacity-70 break-all">Maintainer: {r.maintainer}</div>
              <div className="text-xs opacity-70 break-all">Escrow: {r.escrow || '—'}</div>
              <div className="text-xs opacity-70 break-all">URI: {r.metadataURI || '—'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
