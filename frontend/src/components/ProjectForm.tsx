'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject, updateProject, Project } from '@/lib/api';
import { ChevronRight, AlertCircle } from 'lucide-react';

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    knowledge_scope_policy: project?.knowledge_scope_policy || 'project-private',
    model_policy: project?.model_policy || 'cloud-ok',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (project) {
        await updateProject(project.id, formData);
      } else {
        await createProject(formData);
      }
      router.push('/projects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {/* Section 1: Basic Info */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Project Information</h3>
          <p className="text-slate-600 text-sm">Give your project a meaningful name and description</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Project Name
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="e.g., Customer Portal V2"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="Add a description to help you remember what this project is about..."
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Section 2: Knowledge Scope */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Knowledge Scope Policy</h3>
          <p className="text-slate-600 text-sm">Control who can access this project's knowledge bases</p>
        </div>

        <div className="space-y-3">
          {[
            {
              value: 'project-private',
              title: 'Project Private',
              description: 'Knowledge sources are isolated to this project only',
            },
            {
              value: 'org-shared',
              title: 'Organization Shared',
              description: 'Knowledge sources are accessible across the organization',
            },
            {
              value: 'hybrid',
              title: 'Hybrid',
              description: 'Mix of project-private and organization-shared sources',
            },
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.knowledge_scope_policy === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="knowledge_scope_policy"
                value={option.value}
                checked={formData.knowledge_scope_policy === option.value}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-slate-900">{option.title}</p>
                <p className="text-sm text-slate-600 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Section 3: Model Policy */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Model Policy</h3>
          <p className="text-slate-600 text-sm">Specify which LLM models can be used in this project</p>
        </div>

        <div className="space-y-3">
          {[
            {
              value: 'local-only',
              title: 'Local Only',
              description: 'Use only local LLMs (Ollama, LM Studio, etc.)',
            },
            {
              value: 'cloud-ok',
              title: 'Cloud OK',
              description: 'Allow cloud-hosted LLMs (Claude API, OpenAI, etc.)',
            },
            {
              value: 'specific-providers',
              title: 'Specific Providers',
              description: 'Restrict to specific LLM providers',
            },
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.model_policy === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <input
                type="radio"
                name="model_policy"
                value={option.value}
                checked={formData.model_policy === option.value}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <p className="font-medium text-slate-900">{option.title}</p>
                <p className="text-sm text-slate-600 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 transition-all font-medium"
        >
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          {!loading && <ChevronRight size={20} />}
        </button>
      </div>
    </form>
  );
}
