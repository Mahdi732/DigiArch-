'use client';

import { FormEvent, useState } from 'react';
import { uploadDocument, DocumentDto } from '@/lib/api';

interface UploadFormProps {
  onUploaded?: (doc: DocumentDto) => void;
}

export function UploadForm({ onUploaded }: UploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get('file') as File | null;
    if (!file || file.size === 0) {
      setError('Le PDF est requis.');
      setLoading(false);
      return;
    }

    try {
      const doc = await uploadDocument(formData);
      setSuccess('Document importé et classé.');
      form.reset();
      onUploaded?.(doc);
    } catch (err: any) {
      setError(err?.message || 'Echec de l\'upload');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="section-title">Importer un document PDF</div>
      <div className="flex">
        <div className="flex-col" style={{ flex: 1 }}>
          <label>Prénom</label>
          <input className="input" name="firstName" required placeholder="Ex: Mohamed" />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>Nom</label>
          <input className="input" name="lastName" required placeholder="Ex: Alami" />
        </div>
      </div>
      <div className="flex">
        <div className="flex-col" style={{ flex: 1 }}>
          <label>CIN (optionnel)</label>
          <input className="input" name="cin" placeholder="Ex: AB123456" />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>Département</label>
          <input className="input" name="department" required placeholder="Ex: RH, Finance..." />
        </div>
      </div>
      <div className="flex">
        <div className="flex-col" style={{ flex: 1 }}>
          <label>Type de document</label>
          <input className="input" name="documentType" required placeholder="Ex: Demande congé" />
        </div>
        <div className="flex-col" style={{ flex: 1 }}>
          <label>Description (optionnel)</label>
          <input className="input" name="documentDescription" placeholder="Détails additionnels..." />
        </div>
      </div>
      <div className="flex-col" style={{ marginTop: 16 }}>
        <label>Fichier PDF</label>
        <input 
          className="input" 
          type="file" 
          name="file" 
          accept="application/pdf" 
          required 
          style={{ 
            padding: '16px',
            cursor: 'pointer',
            border: '2px dashed var(--border)'
          }}
        />
      </div>
      <div className="flex" style={{ marginTop: 24, alignItems: 'center' }}>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Uploader et classer'}
        </button>
        {success && <span className="badge status-valid">{success}</span>}
        {error && <span className="badge status-incomplete">{error}</span>}
      </div>
    </form>
  );
}
