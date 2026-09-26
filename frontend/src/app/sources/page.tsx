'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getKnowledgeSources, deleteKnowledgeSource, KnowledgeSource } from '@/lib/api';
import { Plus, FileText, Trash2, Edit2, Search, Lock, Globe } from 'lucide-react';

export default function SourcesPage() {
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSources();
  }, []);

  async function loadSources() {
    try {
      setLoading(true);
      const data = await getKnowledgeSources();
      setSources(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sources');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete source "${name}"?`)) return;
    try {
      await deleteKnowledgeSource(id);
      setSources(sources.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete source');
    }
  }

  const filteredSources = sources.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSourceIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      pdf: '📄',
      docx: '📝',
      xlsx: '📊',
      git_repo: '🔗',
      confluence: '📖',
      jira: '🎯',
      web_page: '🌐',
    };
    return icons[type] || '📁';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Knowledge Sources</h1>
          <p className="text-slate-600 mt-1">Manage documents, repositories, and knowledge bases</p>
        </div>
        <Link
          href="/sources/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          New Source
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* Search */}
      {sources.length > 0 && (
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search sources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading sources...</div>
        </div>
      ) : sources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No sources yet</h3>
          <p className="text-slate-600 mb-6">Create your first knowledge source</p>
          <Link
            href="/sources/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={18} />
            Create Source
          </Link>
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Search size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-600">No sources match your search</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSources.map(source => (
            <div
              key={source.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 flex gap-4">
                  <div className="text-3xl">{getSourceIcon(source.source_type)}</div>
                  <div className="flex-1">
                    <Link
                      href={`/sources/${source.id}`}
                      className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      {source.name}
                    </Link>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        <FileText size={14} />
                        <span className="capitalize">{source.source_type.replace('_', ' ')}</span>
                      </div>

                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        source.visibility === 'project-private'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {source.visibility === 'project-private' ? (
                          <Lock size={14} />
                        ) : (
                          <Globe size={14} />
                        )}
                        <span className="capitalize">{source.visibility.replace('-', ' ')}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm mt-2 break-all">{source.source_uri}</p>
                  </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/sources/${source.id}/edit`}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(source.id, source.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
