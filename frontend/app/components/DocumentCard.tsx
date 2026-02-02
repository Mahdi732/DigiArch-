import { DocumentDto } from '@/lib/api';

interface Props {
  doc: DocumentDto;
}

export function DocumentCard({ doc }: Props) {
  const statusClass =
    doc.documentStatus === 'valid'
      ? 'badge status-valid'
      : doc.documentStatus === 'incomplete'
      ? 'badge status-incomplete'
      : 'badge status-pending';

  return (
    <div className="card">
      <div className="section-title">📄 {doc.documentType}</div>
      <div style={{ fontWeight: 700 }}>{doc.lastName.toUpperCase()} {doc.firstName}</div>
      <div style={{ color: '#475569', marginTop: 4 }}>CIN: {doc.cin || 'Non fournie'}</div>
      <div className="flex" style={{ marginTop: 8 }}>
        <span className="badge">Dept: {doc.department}</span>
        <span className={statusClass}>Statut: {doc.documentStatus}</span>
        <span className="badge">Signature: {doc.signatureDetected ? 'Oui' : 'Non'}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 13, color: '#475569' }}>
        Dossier: {doc.storagePath}
      </div>
      <div style={{ marginTop: 4, fontSize: 13, color: '#475569' }}>
        Fichier: {doc.fileName}
      </div>
      {doc.metadata?.document_description && (
        <div style={{ marginTop: 8, fontSize: 13 }}>
          Description: {doc.metadata.document_description}
        </div>
      )}
    </div>
  );
}
