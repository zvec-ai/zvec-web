'use client';


import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, BarChartIcon, DatabaseIcon, TimerIcon } from 'lucide-react';


const translations = {
  en: {
    title: 'Blazing-Fast Performance',
    link: 'Benchmarked on the Cohere 10M vector dataset —— View full benchmark report',
    label1: 'Total Vectors Indexed',
    label2: 'Index Build Time',
    label3: 'Queries per Second (QPS)',
  },
  zh: {
    title: '高性能',
    link: '基于 Cohere 1000 万向量数据集的基准测试结果 —— 详见性能测试报告',
    label1: '向量数量',
    label2: '构建索引吞吐',
    label3: '每秒查询率 (QPS)',
  },
};


interface Metric {
  value: string;
  label: string;
  icon: React.ReactNode;
}


const PerformanceDemo: React.FC<{ lang: string }> = ({ lang }) => {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const metrics: Metric[] = [
    {
      value: '10M',
      label: t.label1,
      icon: <DatabaseIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
    },
    {
      value: '~1 Hour',
      label: t.label2,
      icon: <TimerIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
    },
    {
      value: '8500+',
      label: t.label3,
      icon: <BarChartIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {t.title}
        </motion.h2>

        {/* Learn More Link */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6"
        >
          <Link
            href="/en/docs/benchmarks/"
            className="inline-flex items-center gap-1.5 text-teal-500 hover:text-teal-600 dark:hover:text-teal-400 font-medium group"
          >
            {t.link}
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-y-[-2px] group-hover:translate-x-[2px]" />
          </Link>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/80 to-white dark:from-gray-800/60 dark:to-gray-800 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-emerald-400/40 transition-all duration-300"
          >
            {/* Icon */}
            <div className="mb-5">{metric.icon}</div>

            {/* Value */}
            <motion.span
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.1 + 0.3 }}
              className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2 text-teal-500"
            >
              {metric.value}
            </motion.span>

            {/* Label */}
            <span className="text-center text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
              {metric.label}
            </span>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};


export default PerformanceDemo;