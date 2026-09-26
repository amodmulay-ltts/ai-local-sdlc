'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects, deleteProject, Project } from '@/lib/api';
import { Plus, Lock, Globe, Settings, Trash2, Edit2, Search } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete project "${name}"?`)) return;
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project');
    }
  }

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScopeIcon = (scope: string) => {
    return scope === 'project-private' ? <Lock size={16} /> : <Globe size={16} />;
  };

  const getScopeBadgeColor = (scope: string) => {
    return scope === 'project-private'
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage your SDLC projects and knowledge scopes</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          New Project
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* Search */}
      {projects.length > 0 && (
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <Settings size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-6">Create your first project to get started</p>
          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Create Project
          </Link>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Search size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600">No projects match your search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-lg font-semibold text-slate-900 hover:text-blue-600 transition-colors"
                  >
                    {project.name}
                  </Link>

                  {project.description && (
                    <p className="text-slate-600 text-sm mt-1">{project.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getScopeBadgeColor(project.knowledge_scope_policy)}`}>
                      {getScopeIcon(project.knowledge_scope_policy)}
                      <span className="capitalize">{project.knowledge_scope_policy.replace('-', ' ')}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                      <Settings size={14} />
                      <span className="capitalize">{project.model_policy.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/projects/${project.id}/edit`}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit project"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id, project.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
