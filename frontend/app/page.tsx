import { UploadForm } from './components/UploadForm';
import { SearchPanel } from './components/SearchPanel';

export default function Home() {
  return (
    <main className="page">
      <div className="header">
        <span className="badge" style={{ 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))',
          color: 'white',
          borderColor: 'transparent',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}>
          ✨ GED + IA + MinIO
        </span>
        <h1 style={{ 
          fontSize: '56px', 
          margin: 0,
          background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 900,
          letterSpacing: '-2px'
        }}>
          DigiArch
        </h1>
        <p style={{ 
          maxWidth: 720, 
          color: 'var(--text-muted)',
          fontSize: '17px',
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
