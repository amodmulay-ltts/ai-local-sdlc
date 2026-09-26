'use client';

import SourceForm from '@/components/SourceForm';

export default function NewSourcePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Knowledge Source</h1>
        <p className="mt-1 text-gray-600">Add a new document, file, or repository to your knowledge base</p>
      </div>
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <SourceForm />
      </div>
    </div>
  );
}
