'use client';

import ProjectForm from '@/components/ProjectForm';
import { FolderOpen } from 'lucide-react';

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FolderOpen size={28} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
        </div>
        <p className="text-slate-600">Set up a new SDLC project with your knowledge scope and model policies</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <ProjectForm />
      </div>
    </div>
  );
}
