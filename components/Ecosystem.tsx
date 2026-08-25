import { ArrowUpRight } from 'lucide-react';


const translations = {
  en: {
    title: 'Open-source integrations',
    description: 'Beyond the product family, open-source projects embed Zvec across knowledge tools, agent memory, AI frameworks, and data pipelines.',
    role: 'Zvec role',
    projects: [
      ['Logseq', 'Knowledge management', 'Desktop hybrid search over local graphs and embeddings.', 'Hybrid retrieval'],
      ['MyContext', 'Personal context', 'Private context retrieval and knowledge-graph memory.', 'Vector storage'],
      ['ReMe', 'Agent memory', 'Persistent local memory that agents can search and recall.', 'Memory backend'],
      ['txtai', 'AI framework', 'Semantic search inside an all-in-one AI framework.', 'Dense ANN'],
      ['CocoIndex', 'Data pipeline', 'Incremental data pipelines that stay connected to retrieval.', 'Index connector'],
    ],
  },
  zh: {
    title: '开源生态集成',
    description: '在产品体系之外，开源项目也将 Zvec 嵌入知识工具、Agent 记忆、AI 框架与数据管道。',
    role: 'Zvec 的作用',
    projects: [
      ['Logseq', '知识管理', '在本地图谱与 Embedding 上提供桌面端混合检索。', '混合检索'],
      ['MyContext', '个人上下文', '支撑私有上下文检索与知识图谱记忆。', '向量存储'],
      ['ReMe', 'Agent 记忆', '提供可检索、可召回的持久化本地记忆。', '记忆后端'],
      ['txtai', 'AI 框架', '在一体化 AI 框架中提供语义检索。', '稠密 ANN'],
      ['CocoIndex', '数据管道', '让增量数据管道持续连接检索能力。', '索引 Connector'],
    ],
  },
};


const projects = [
  { icon: 'https://raw.githubusercontent.com/logseq/logseq/master/resources/icon.png', href: 'https://github.com/logseq/logseq', mark: 'logseq' },
  { icon: 'https://raw.githubusercontent.com/openTrinity/mycontext/main/apps/desktop/build/icon.png', href: 'https://github.com/openTrinity/mycontext', mark: 'mycontext' },
  { icon: 'https://raw.githubusercontent.com/agentscope-ai/ReMe/main/website/public/favicon.svg', href: 'https://github.com/agentscope-ai/ReMe', mark: 'reme' },
  { icon: 'https://raw.githubusercontent.com/neuml/txtai/master/logo.png', href: 'https://github.com/neuml/txtai', mark: 'txtai' },
  { icon: 'https://raw.githubusercontent.com/cocoindex-io/cocoindex/main/docs/public/images/coconut.svg', href: 'https://github.com/cocoindex-io/cocoindex', mark: 'cocoindex' },
];


export default function Ecosystem({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <section className="zvec-section" id="ecosystem">
      <div className="zvec-container">
        <div className="zvec-section-heading" style={{ width: '100%', maxWidth: 'none', marginInline: 'auto', textAlign: 'center' }}>
          <h2>{t.title}</h2>
          <p>{t.description}</p>
        </div>
        <div className="zvec-ecosystem-grid">
          {t.projects.map(([name, category, description, role], index) => (
            <a className="zvec-ecosystem-card" href={projects[index].href} target="_blank" rel="noreferrer" key={name}>
              <div className="zvec-project-topline">
                <div className={`zvec-project-mark zvec-project-mark-${projects[index].mark}`}>
                  <img src={projects[index].icon} alt="" loading="lazy" />
                </div>
                <span>{category}</span>
              </div>
              <div className="zvec-project-copy">
                <h3>{name}</h3>
                <p>{description}</p>
              </div>
              <div className="zvec-project-role"><small>{t.role}</small><strong>{role}</strong></div>
              <ArrowUpRight className="zvec-project-arrow" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
