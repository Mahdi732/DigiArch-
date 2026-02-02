# DigiArch - GED IA (NestJS + Next.js)

Plateforme de Gestion Electronique de Documents pour numériser, classer et rechercher les archives via MinIO, MongoDB et une extraction assistée par IA (LLM stub).

## Fonctionnalités livrées
- Upload de PDF avec formulaires (nom, prénom, CIN optionnel, département, type de document, description).
- Classement automatique dans MinIO selon la règle :
  - `nom_prenom_cin/departement/type/` quand la CIN est fournie.
  - `departement/type_nom_prenom/` si la CIN est absente.
  - Incrément auto du fichier (`type.pdf`, `type1.pdf`, ...).
- Génération d'un `metadata.json` déposé aux côtés du PDF (statut, signature détectée, besoins de vérification humaine, etc.).
- Persistance des métadonnées dans MongoDB pour la recherche.
- API de recherche multi-critères (nom, prénom, CIN, département, type).
- Frontend Next.js (app router) : upload, recherche et visualisation des métadonnées.
- Conteneurisation Docker (backend, frontend, MongoDB, MinIO) + CI GitHub Actions (lint, build, docker build).

## Architecture
- **Backend** : NestJS, MongoDB (Mongoose), MinIO SDK, DTO + validation.
- **Frontend** : Next.js 14 (app router), React 18, SWR, design léger sans dépendance UI.
- **Stockage** : MinIO pour les fichiers + `metadata.json`.
- **LLM** : Service stub prêt à être branché à OpenAI/Azure OpenAI via `OPENAI_API_KEY`.

### Arborescence
- `backend/` : API NestJS (`/api/documents/upload`, `/api/documents/search`, `/api/documents/:id`).
- `frontend/` : Next.js UI (upload + recherche + cards de documents).
- `.github/workflows/ci.yml` : lint/build + docker build.
- `docker-compose.yml` : MongoDB, MinIO (+mc), backend, frontend.

## Démarrage rapide
1) Copier le modèle d'environnement :
```bash
cp .env.example .env
```
2) Lancer en local sans Docker :
```bash
npm install --workspaces
npm run start:dev -w backend
# dans un autre terminal
npm run dev -w frontend
```
3) Ou via Docker Compose :
```bash
docker-compose up --build
```
- Frontend : http://localhost:3001
- Backend API : http://localhost:3000/api
- MinIO console : http://localhost:9001 (admin/minioadmin par défaut)

## Variables d'environnement principales
Voir `.env.example` : `MONGO_URI`, `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`, `OPENAI_API_KEY`, `NEXT_PUBLIC_API_URL`, `ARCHIVING_MANAGER_NAME`.

## API (extraits)
- `POST /api/documents/upload` (multipart `file` + body JSON fields) → enregistre PDF + `metadata.json` + Mongo.
- `GET /api/documents/search?firstName=&lastName=&cin=&department=&documentType=` → liste filtrée.
- `GET /api/documents/:id` → métadonnées d'un document.

## Tests / Qualité
- `npm run lint` (back : `tsc --noEmit`, front : `next lint`).
- `npm run build` (tsc + `next build`).

## Points à brancher ultérieurement
- Implémentation réelle de l'appel LLM dans `backend/src/llm/llm.service.ts` (prévoir client OpenAI + prompts).
- Authentification/roles (admin, responsable d'archives) et audit trail détaillé.
- Visualisation PDF côté frontend (iframe/preview) et édition des métadonnées.
- Historisation versionnée dans Mongo (actuellement une version par upload).

## Planification / JIRA
- Créer les epics : "Upload & Classement", "Recherche", "LLM & Métadonnées", "Infra/CI".
- Décliner en stories (ex : upload PDF, règle de nommage, extraction LLM, UI recherche).
- Lier les PR GitHub aux tickets JIRA pour le suivi.

## Commandes utiles
- `npm run dev:backend` / `npm run dev:frontend` : modes dev séparés.
- `docker-compose up --build` : pile complète avec Mongo + MinIO.
- `docker build ./backend -t digiarch-backend:local` (idem frontend) pour tester les images.

## Sécurité & erreurs
- Validation et whitelist des champs (class-validator) côté API.
- Gestion des erreurs d'upload (fichier requis) et de duplication (suffixes auto).
- CORS activé côté Nest pour permettre l'appel depuis le frontend.
