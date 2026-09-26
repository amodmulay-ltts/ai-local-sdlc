'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getModelProfiles, deleteModelProfile, ModelProfile } from '@/lib/api';
import { Plus, Cloud, Server, Settings, Trash2, Edit2, Search } from 'lucide-react';

export default function ModelsPage() {
  const [models, setModels] = useState<ModelProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      setLoading(true);
      const data = await getModelProfiles();
      setModels(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load models');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete model "${name}"?`)) return;
    try {
      await deleteModelProfile(id);
      setModels(models.filter(m => m.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete model');
    }
  }

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cloudModels = filteredModels.filter(m => !m.is_local);
  const localModels = filteredModels.filter(m => m.is_local);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Model Profiles</h1>
          <p className="text-slate-600 mt-1">Configure and manage LLM models</p>
        </div>
        <Link
          href="/models/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          New Model
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-3">
          <div className="mt-0.5">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* Search */}
      {models.length > 0 && (
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-600">Loading models...</div>
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
          <Settings size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No models yet</h3>
          <p className="text-slate-600 mb-6">Create your first model profile</p>
          <Link
            href="/models/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={18} />
            Create Model
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {cloudModels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud size={24} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-900">Cloud Models</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cloudModels.map(model => <ModelCard key={model.id} model={model} onDelete={handleDelete} />)}
              </div>
            </div>
          )}

          {localModels.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Server size={24} className="text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">Local Models</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localModels.map(model => <ModelCard key={model.id} model={model} onDelete={handleDelete} />)}
              </div>
            </div>
          )}

          {filteredModels.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Search size={40} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-600">No models match your search</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModelCard({ model, onDelete }: { model: ModelProfile; onDelete: (id: number, name: string) => void }) {
  const Icon = model.is_local ? Server : Cloud;
  const badgeColor = model.is_local
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-blue-50 text-blue-700 border-blue-200';

  return (
    <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2 rounded-lg ${model.is_local ? 'bg-emerald-100' : 'bg-blue-100'}`}>
          <Icon size={24} className={model.is_local ? 'text-emerald-600' : 'text-blue-600'} />
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/models/${model.id}/edit`}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit2 size={18} />
          </Link>
          <button
            onClick={() => onDelete(model.id, model.name)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-1">{model.name}</h3>

      <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border mb-3 ${badgeColor}`}>
        {model.is_local ? 'Local' : 'Cloud'}
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div>
          <span className="font-medium text-slate-700">Provider:</span> {model.provider}
        </div>
        <div>
          <span className="font-medium text-slate-700">Model:</span> {model.model_id}
        </div>
        {model.temperature !== undefined && (
          <div>
            <span className="font-medium text-slate-700">Temperature:</span> {model.temperature}
          </div>
        )}
      </div>
    </div>
  );
}
