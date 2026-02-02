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
    <div className="card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="section-title" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>
        📄 {doc.documentType}
      </div>
      <div style={{
        fontWeight: 700,
        fontSize: '18px',
        color: 'var(--text)',
        marginBottom: '6px'
      }}>
        {doc.lastName.toUpperCase()} {doc.firstName}
      </div>
      <div style={{
        color: 'var(--text-muted)',
        marginTop: 4,
        fontSize: '13px'
      }}>
        CIN: {doc.cin || 'Non fournie'}
      </div>
      <div className="flex" style={{
        marginTop: 14,
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span className="badge">Dept: {doc.department}</span>
        <span className={statusClass}>{doc.documentStatus}</span>
        <span className="badge">
          {doc.signatureDetected ? 'Signature détectée' : 'Pas de signature'}
        </span>
      </div>
      <div style={{
        marginTop: 16,
        padding: '12px',
        background: '#0d0f14',
        borderRadius: '10px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        fontFamily: 'monospace'
      }}>
        <div>Chemin: {doc.storagePath}</div>
        <div style={{ marginTop: 4 }}>Fichier: {doc.fileName}</div>
      </div>
      {doc.metadata?.document_description && (
        <div style={{
          marginTop: 12,
          fontSize: 13,
          color: 'var(--text)',
          padding: '10px',
          borderLeft: '3px solid #2f343d',
          background: '#101219',
          borderRadius: '6px'
        }}>
          {doc.metadata.document_description}
        </div>
      )}
    </div>
  );
}
