'use client';


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Code, Plus, Search } from 'lucide-react';


const translations = {
  en: {
    title: 'Simple, Intuitive Python API',
  },
  zh: {
    title: '简单易用的 Python API',
  },
};


function Text({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <h2
        className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white leading-tight"
        style={{ fontFamily: 'inter', letterSpacing: '-0.02em' }}
      >
        {t.title}
      </h2>
    </motion.div>
  );
}


type TabType = 'create' | 'insert' | 'search';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  code: string;
}

const TABS: TabConfig[] = [
  {
    id: 'create',
    label: 'Create',
    icon: <Plus className="w-4 h-4" />,
    code: `import zvec

schema = zvec.CollectionSchema(
    name="example",
    vectors=zvec.VectorSchema("embedding", zvec.DataType.VECTOR_FP32, 4),
)
collection = zvec.create_and_open(path="./zvec_example", schema=schema)`,
  },
  {
    id: 'insert',
    label: 'Insert',
    icon: <Code className="w-4 h-4" />,
    code: `import zvec

collection = zvec.open("./zvec_example")
collection.insert(zvec.Doc(id="1", vectors={"embedding": [0.1, 0.2, 0.3, 0.4]}))`,
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search className="w-4 h-4" />,
    code: `import zvec

collection = zvec.open("./zvec_example")
results = collection.query(
    vectors=zvec.VectorQuery("embedding", vector=[0.4, 0.3, 0.3, 0.1]),
    topk=10,
)`,
  },
];


interface TabButtonProps {
  tab: TabType;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, onClick }) => {
  const config = TABS.find((t) => t.id === tab);
  if (!config) return null;
  const { icon, label } = config;
  return (
    <button
      onClick={onClick}
      className={`
          flex relative items-center gap-2 px-4 py-1.5
          text-sm font-medium rounded-lg transition-all duration-200
          ${isActive ?
          'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          :
          'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'}`
      }
    >
      {icon}
      {label}
    </button>
  );
};


interface CodeRendererProps {
  code: string;
  isActive: boolean;
  refCallback: (el: HTMLDivElement | null) => void;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ code, isActive, refCallback }) => {
  return (
    <div
      ref={refCallback}
      className={
        `absolute inset-x-0 top-0 p-4 transition-opacity duration-200
        ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
      }
    >
      <DynamicCodeBlock
        lang="python"
        options={{ themes: { light: 'catppuccin-latte', dark: 'catppuccin-mocha' } }}
        codeblock={{
          className: '!bg-transparent !border-0 !shadow-none !my-0',
          style: { fontSize: '0.875rem', lineHeight: '1.5' },
        }}
        code={code}
      />
    </div>
  );
};


const CodeTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('create');
  const [containerHeight, setContainerHeight] = useState('auto');

  const refs = useRef<Record<TabType, HTMLDivElement | null>>({
    create: null,
    insert: null,
    search: null,
  });

  const measureHeights = useCallback(() => {
    const heights = {
      create: refs.current.create?.offsetHeight || 0,
      insert: refs.current.insert?.offsetHeight || 0,
      search: refs.current.search?.offsetHeight || 0,
    };
    setContainerHeight(`${heights[activeTab]}px`);
  }, [activeTab]);

  useEffect(() => {
    measureHeights();
    window.addEventListener('resize', measureHeights);
    return () => window.removeEventListener('resize', measureHeights);
  }, [measureHeights]);

  useEffect(() => {
    const h = refs.current[activeTab]?.offsetHeight || 0;
    setContainerHeight(`${h}px`);
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="w-full"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
        {/* Tab Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-400"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-400"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-green-400"></span>
            </div>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400 tracking-wide">
              zvec
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            {TABS.map((tab) => (
              <TabButton key={tab.id} tab={tab.id} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
            ))}
          </div>
        </div>

        {/* Animated Code Container */}
        <div
          className="relative overflow-hidden transition-[height] duration-300 ease-in-out"
          style={{ height: containerHeight }}
        >
          {TABS.map((tab) => (
            <CodeRenderer
              key={tab.id}
              code={tab.code}
              isActive={activeTab === tab.id}
              refCallback={(el) => (refs.current[tab.id] = el)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};


const CodeDemo: React.FC<{ lang: string }> = ({ lang }) => {
  return (
    <section className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-[min(1344px,90vw)] mx-auto grid grid-cols-1 lg:grid-cols-[4fr_5fr] gap-8 lg:gap-10 items-center">
        <Text lang={lang} />
        <CodeTabs />
      </div>
    </section>
  );
};


export default CodeDemo;