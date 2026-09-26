'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createKnowledgeSource,
  updateKnowledgeSource,
  KnowledgeSource,
  getProjects,
  Project,
} from '@/lib/api';

interface SourceFormProps {
  source?: KnowledgeSource;
}

export default function SourceForm({ source }: SourceFormProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    name: source?.name || '',
    source_type: source?.source_type || 'pdf',
    source_uri: source?.source_uri || '',
    project_id: source?.project_id || undefined,
    visibility: source?.visibility || 'project-private',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'project_id' ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (source) {
        await updateKnowledgeSource(source.id, formData);
      } else {
        await createKnowledgeSource(formData);
      }
      router.push('/sources');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save source');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Product Requirements"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source Type *
        </label>
        <select
          name="source_type"
          value={formData.source_type}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="pdf">PDF Document</option>
          <option value="docx">Word Document</option>
          <option value="xlsx">Excel Spreadsheet</option>
          <option value="git_repo">Git Repository</option>
          <option value="confluence">Confluence Page</option>
          <option value="jira">Jira Issue</option>
          <option value="web_page">Web Page</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source URI *
        </label>
        <input
          type="text"
          name="source_uri"
          value={formData.source_uri}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="s3://bucket/requirements.pdf"
        />
        <p className="mt-1 text-xs text-gray-500">
          File path, URL, or identifier for the source
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Associated Project (Optional)
        </label>
        <select
          name="project_id"
          value={formData.project_id || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">No Project (Organization Shared)</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Leave empty for org-shared sources, select a project for project-scoped sources
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Visibility *
        </label>
        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="project-private">Project Private (scoped access)</option>
          <option value="org-shared">Organization Shared (everyone)</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : source ? 'Update Source' : 'Create Source'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
