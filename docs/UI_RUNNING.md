# Engineering Intelligence Factory - UI Running

## Status: ✅ FULLY OPERATIONAL

### Backend API
- **Server:** http://localhost:8000
- **Status:** Running (Uvicorn)
- **API Docs:** http://localhost:8000/docs (Swagger)
- **Health:** http://localhost:8000/health

### Frontend UI
- **Server:** http://localhost:3001
- **Status:** Running (Next.js 16 with Turbopack)
- **Environments:** .env.local (API_URL=http://localhost:8000)

---

## 🚀 Access the Application

**Open your browser:** http://localhost:3001

---

## 📋 Features Implemented (M1 - Core Data Model)

### Dashboard
- Overview of all features
- Quick navigation to Projects, Models, Sources

### Projects Management
- **List Projects** - View all projects with scopes
- **Create Project** - New project with:
  - Name & description
  - Knowledge scope policy (project-private, org-shared, hybrid)
  - Model policy (local-only, cloud-ok, specific-providers)
- **Edit Project** - Modify project settings
- **Delete Project** - Remove projects

### Model Profiles
- **List Models** - View cloud & local models
  - Filter by type (LOCAL/CLOUD)
  - Provider badges (Anthropic, Ollama, etc.)
- **Create Model** - Configure LLMs:
  - Cloud: Anthropic Claude API, OpenAI
  - Local: Ollama, LM Studio
  - Temperature, max tokens, cost class
- **Edit Model** - Update model settings
- **Delete Model** - Remove configurations

### Knowledge Sources
- **List Sources** - Browse all knowledge bases
  - Icons by type (PDF, DOCX, XLSX, Git, etc.)
  - Visibility badges
  - Ingestion status
- **Create Source** - Add knowledge base:
  - Multiple source types
  - Project scoping (optional)
  - URI/path configuration
- **Edit Source** - Modify source settings
- **Delete Source** - Remove sources

---

## 🎨 Design System

**Minimal, Production-Ready UI:**
- Clean white/gray color palette
- Tailwind CSS for styling
- Simple, scannable layouts
- Icon-based navigation
- Responsive design (desktop first)
- Form validation & error handling
- Loading states
- Success/error feedback

---

## 🔌 API Integration

Frontend → Backend (TypeScript API client)
- `lib/api.ts` - Fully typed API methods
- Automatic error handling
- Environment-based API URL

```typescript
// Example: Create a project
import { createProject } from '@/lib/api';
const project = await createProject({
  name: 'My Project',
  knowledge_scope_policy: 'project-private',
  model_policy: 'cloud-ok',
});
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── layout.tsx         # Root layout + Navigation
│   │   ├── projects/
│   │   │   ├── page.tsx       # Projects list
│   │   │   └── new/page.tsx   # New project form
│   │   ├── models/
│   │   │   ├── page.tsx       # Models list
│   │   │   └── new/page.tsx   # New model form
│   │   ├── sources/
│   │   │   ├── page.tsx       # Sources list
│   │   │   └── new/page.tsx   # New source form
│   │   └── globals.css
│   ├── lib/
│   │   └── api.ts            # Typed API client
│   └── components/
│       ├── Navigation.tsx     # Top navigation
│       ├── ProjectForm.tsx    # Project form component
│       ├── ModelForm.tsx      # Model form component
│       └── SourceForm.tsx     # Source form component
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ✨ UI Pages

### Dashboard (/)
Card-based overview of three main features

### Projects (/projects)
List view with create/edit/delete actions

### Model Profiles (/models)
Card grid showing cloud and local models separately

### Knowledge Sources (/sources)
List view with source type icons and status badges

---

## 🔄 Complete Workflow Example

1. **Create a Project**
   - Navigate to Projects → New Project
   - Fill in name, scope, and model policy
   - Click "Create Project"

2. **Create Model Profiles**
   - Go to Model Profiles → New Model
   - Create "Claude API" (cloud) and "Ollama" (local)

3. **Create Knowledge Source**
   - Go to Knowledge Sources → New Source
   - Add PDF, DOCX, or Git repo
   - Optionally scope to a project
   - Set visibility

4. **All data persists** in PostgreSQL backend

---

## 🧪 Testing

Open http://localhost:3001 and:

1. ✅ Create a project
2. ✅ Create cloud and local models
3. ✅ Create knowledge sources
4. ✅ Filter local-only models
5. ✅ Edit/delete any resource
6. ✅ Verify error handling

---

## 📊 Tech Stack

**Frontend:**
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- React Hooks (no external state management)

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL with psycopg
- Pydantic for validation

**Communication:**
- REST API with JSON
- CORS enabled
- Environment-based configuration

---

## 🚢 Production Readiness

✅ Type-safe (TypeScript)
✅ Error handling & validation
✅ Loading states
✅ Responsive design
✅ Clean code & structure
✅ Minimal dependencies
✅ Environment configuration
✅ API client abstraction

---

## 📝 Next Steps

After M1, M2 will add:
- LLM adapter layer (Anthropic, Ollama)
- Local model manager (download/install)
- Cost logging & tracking
- Request/response caching

And then:
- M3: Ingestion pipeline (parse PDFs, DOCX, etc.)
- M4: Embedding & vector search
- M5: Orchestrator & agents
- M6-M9: Core SDLC workflows
- M10: Auth & RBAC

---

**Built:** 2026-09-27
**Milestone:** M1 (Core Data Model) - Complete
**Status:** Ready for M2 development
