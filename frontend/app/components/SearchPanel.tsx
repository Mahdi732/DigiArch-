'use client';

import { FormEvent, useState } from 'react';
import { searchDocuments, SearchParams, DocumentDto } from '@/lib/api';
import { DocumentCard } from './DocumentCard';

export function SearchPanel() {
  const [filters, setFilters] = useState<SearchParams>({});
  const [results, setResults] = useState<DocumentDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await searchDocuments(filters);
      setResults(data);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof SearchParams, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card">
      <div className="section-title">🔎 Recherche multi-critères</div>
      <form className="flex" onSubmit={handleSubmit}>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>👤 Prénom</label>
          <input className="input" onChange={(e) => updateField('firstName', e.target.value)} placeholder="Rechercher..." />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>👤 Nom</label>
          <input className="input" onChange={(e) => updateField('lastName', e.target.value)} placeholder="Rechercher..." />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>🆔 CIN</label>
          <input className="input" onChange={(e) => updateField('cin', e.target.value)} placeholder="Ex: AB123456" />
        </div>
      </form>
      <form className="flex" style={{ marginTop: 16 }} onSubmit={handleSubmit}>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>🏢 Département</label>
          <input className="input" onChange={(e) => updateField('department', e.target.value)} placeholder="RH, Finance..." />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>📋 Type de document</label>
          <input className="input" onChange={(e) => updateField('documentType', e.target.value)} placeholder="Type..." />
        </div>
        <div className="flex-col" style={{ justifyContent: 'flex-end', display: 'flex' }}>
          <button className="button" type="submit" disabled={loading}>
            {loading ? '🔍 Recherche...' : '🔎 Rechercher'}
          </button>
        </div>
      </form>
      {error && <div className="badge status-incomplete" style={{ marginTop: 12 }}>⚠️ {error}</div>}
      <div className="results">
        {results.length === 0 && !loading && (
          <div style={{ 
            color: 'var(--text-muted)', 
            textAlign: 'center',
            padding: '32px',
            background: 'var(--bg)',
            borderRadius: '12px',
            fontSize: '15px'
          }}>
            📭 Aucun résultat pour le moment. Lancez une recherche pour voir les documents.
          </div>
        )}
        {results.map((doc) => (
          <DocumentCard key={doc._id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
