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
      <div className="section-title" style={{ fontSize: '18px' }}>
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
        fontSize: '14px'
      }}>
        🆔 CIN: {doc.cin || 'Non fournie'}
      </div>
      <div className="flex" style={{ 
        marginTop: 16, 
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <span className="badge">🏢 {doc.department}</span>
        <span className={statusClass}>{doc.documentStatus}</span>
        <span className="badge">
          {doc.signatureDetected ? '✍️ Signée' : '❌ Non signée'}
        </span>
      </div>
      <div style={{ 
        marginTop: 16, 
        padding: '12px', 
        background: 'var(--bg)',
        borderRadius: '10px',
        fontSize: '13px',
        color: 'var(--text-muted)',
        fontFamily: 'monospace'
      }}>
        <div>📁 {doc.storagePath}</div>
        <div style={{ marginTop: 4 }}>📄 {doc.fileName}</div>
      </div>
      {doc.metadata?.document_description && (
        <div style={{ 
          marginTop: 12, 
          fontSize: 14,
          color: 'var(--text)',
          padding: '10px',
          borderLeft: '3px solid var(--primary)',
          background: 'rgba(20, 184, 166, 0.05)',
          borderRadius: '6px'
        }}>
          💬 {doc.metadata.document_description}
        </div>
      )}
    </div>
  );
}
