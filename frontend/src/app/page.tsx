'use client';

import Link from 'next/link';
import { FolderOpen, Cpu, BookOpen, ArrowRight, Zap } from 'lucide-react';

export default function Dashboard() {
  const features = [
    {
      icon: FolderOpen,
      title: 'Projects',
      description: 'Organize and manage SDLC projects with knowledge scoping policies',
      href: '/projects',
      color: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50 text-blue-700',
    },
    {
      icon: Cpu,
      title: 'Model Profiles',
      description: 'Configure and manage local and cloud LLM models',
      href: '/models',
      color: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50 text-purple-700',
    },
    {
      icon: BookOpen,
      title: 'Knowledge Sources',
      description: 'Ingest, organize, and manage knowledge bases',
      href: '/sources',
      color: 'from-emerald-500 to-emerald-600',
      lightColor: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const stats = [
    { label: 'Active Projects', value: '0', icon: FolderOpen },
    { label: 'Model Profiles', value: '0', icon: Cpu },
    { label: 'Knowledge Sources', value: '0', icon: BookOpen },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={28} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Dashboard</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          AI-powered Software Development Lifecycle Management System
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md dark:hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{stat.value}</p>
                </div>
                <Icon size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />

                <div className="relative p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.lightColor} dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Explore
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 rounded-xl p-8 text-white border border-slate-700 dark:border-slate-600">
        <div className="max-w-2xl">
          <h3 className="text-2xl font-bold mb-3">Getting Started</h3>
          <p className="text-slate-300 dark:text-slate-400 mb-6">
            Create your first project, configure LLM models, and add knowledge sources to build your AI-powered SDLC system.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-400">Backend API</p>
              <p className="text-slate-200 font-mono text-sm mt-1">http://localhost:8000</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">API Documentation</p>
              <Link href="http://localhost:8000/docs" target="_blank" className="text-blue-400 hover:text-blue-300 font-mono text-sm mt-1">
                /docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
