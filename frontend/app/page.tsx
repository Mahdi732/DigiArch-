import { UploadForm } from './components/UploadForm';
import { SearchPanel } from './components/SearchPanel';

export default function Home() {
  return (
    <main className="page">
      <div className="header">
        <span className="badge">GED + IA + MinIO</span>
        <h1 style={{ fontSize: '36px', margin: 0 }}>DigiArch</h1>
        <p style={{ maxWidth: 720, color: '#475569' }}>
          Plateforme de Gestion Electronique de Documents : import PDF, extraction assistée par IA,
          classement automatique, recherche multi-critères et historisation des archives.
        </p>
      </div>
      <div className="card-grid">
        <UploadForm />
        <SearchPanel />
      </div>
    </main>
  );
}
