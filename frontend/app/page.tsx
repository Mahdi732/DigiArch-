import { UploadForm } from './components/UploadForm';
import { SearchPanel } from './components/SearchPanel';

export default function Home() {
  return (
    <main className="page">
      <div className="header">
        <span className="badge" style={{
          background: '#0b0b0d',
          color: '#f5f5f5',
          borderColor: '#2f343d',
          fontSize: '13px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          GED + IA + MinIO
        </span>
        <h1 style={{
          fontSize: '52px',
          margin: 0,
          color: '#f5f5f5',
          fontWeight: 900,
          letterSpacing: '-1.5px'
        }}>
          DigiArch
        </h1>
        <p style={{
          maxWidth: 720,
          color: 'var(--text-muted)',
          fontSize: '16px',
          lineHeight: '1.7'
        }}>
          Plateforme moderne de Gestion Electronique de Documents : import PDF intelligent,
          extraction assistée par IA, classement automatique, recherche multi-critères et
          historisation des archives.
        </p>
      </div>
      <div className="card-grid">
        <UploadForm />
        <SearchPanel />
      </div>
    </main>
  );
}
