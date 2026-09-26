'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createModelProfile, updateModelProfile, ModelProfile } from '@/lib/api';

interface ModelFormProps {
  model?: ModelProfile;
}

export default function ModelForm({ model }: ModelFormProps) {
  const router = useRouter();
  const [isLocal, setIsLocal] = useState(model?.is_local || false);
  const [formData, setFormData] = useState({
    name: model?.name || '',
    description: model?.description || '',
    provider: model?.provider || 'anthropic',
    model_id: model?.model_id || '',
    endpoint: model?.endpoint || '',
    api_key_ref: model?.api_key_ref || '',
    temperature: model?.temperature || 0.7,
    max_tokens: model?.max_tokens || 2000,
    cost_class: model?.cost_class || 'moderate',
    is_local: model?.is_local || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (model) {
        await updateModelProfile(model.id, formData);
      } else {
        await createModelProfile(formData);
      }
      router.push('/models');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save model');
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
          Model Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Claude 3 Opus"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Model Type
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={!isLocal}
              onChange={() => {
                setIsLocal(false);
                setFormData(prev => ({ ...prev, is_local: false, provider: 'anthropic' }));
              }}
            />
            <span className="text-sm">Cloud (API)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={isLocal}
              onChange={() => {
                setIsLocal(true);
                setFormData(prev => ({ ...prev, is_local: true, provider: 'ollama' }));
              }}
            />
            <span className="text-sm">Local (Ollama)</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Provider *
        </label>
        <select
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {!isLocal ? (
            <>
              <option value="anthropic">Anthropic (Claude API)</option>
              <option value="openai">OpenAI</option>
            </>
          ) : (
            <>
              <option value="ollama">Ollama</option>
              <option value="lm_studio">LM Studio</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model ID *
        </label>
        <input
          type="text"
          name="model_id"
          value={formData.model_id}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="claude-3-opus-20250219"
        />
      </div>

      {isLocal && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint
          </label>
          <input
            type="text"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="http://localhost:11434"
          />
        </div>
      )}

      {!isLocal && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Key Reference
          </label>
          <input
            type="text"
            name="api_key_ref"
            value={formData.api_key_ref}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="sk-ant-..."
          />
          <p className="mt-1 text-xs text-gray-500">Reference to API key (not the actual key)</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperature
          </label>
          <input
            type="number"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            min="0"
            max="2"
            step="0.1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Tokens
          </label>
          <input
            type="number"
            name="max_tokens"
            value={formData.max_tokens}
            onChange={handleChange}
            min="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cost Class
        </label>
        <select
          name="cost_class"
          value={formData.cost_class}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="free">Free (Local)</option>
          <option value="cheap">Cheap</option>
          <option value="moderate">Moderate</option>
          <option value="expensive">Expensive</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : model ? 'Update Model' : 'Create Model'}
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
