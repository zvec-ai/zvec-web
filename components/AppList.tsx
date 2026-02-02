'use client';


import React from 'react';


interface AppCard {
  title: string;
  description: string;
  icon: string;
}

const AppList: AppCard[] = [
  {
    title: 'RAG (Retrieval-Augmented Generation)',
    description: 'Enhance LLM responses with information retrieved from your knowledge base',
    icon: '📚',
  },
  {
    title: 'Image Search',
    description: 'Find visually or semantically similar images at scale',
    icon: '🖼️',
  },
  {
    title: 'Code Search',
    description: 'Find code snippets by describing what you want in natural language',
    icon: '💻',
  },
];


const AppCard: React.FC<{ app: AppCard }> = ({ app }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className="relative flex flex-col h-full p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-600 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Accent top bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 transition-transform duration-300 ${isHovered ? 'scale-x-100' : 'scale-x-0'
          } origin-left`}
      />

      <div className="text-4xl mb-6">{app.icon}</div>

      <div className="flex-1">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
          {app.title}
        </h3>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm line-clamp-2">
          {app.description}
        </p>
      </div>
    </div>
  );
};

// Main Component
const Apps: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
            Build Powerful AI Applications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {AppList.map((app, index) => (
            <AppCard key={index} app={app} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Apps;