'use client';

import ModelForm from '@/components/ModelForm';

export default function NewModelPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Model Profile</h1>
        <p className="mt-1 text-gray-600">Configure a new LLM (local or cloud)</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <ModelForm />
      </div>
    </div>
  );
}
