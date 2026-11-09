import Image from 'next/image';
import { Mail } from 'lucide-react';
import { FaDiscord, FaGithub, FaWeixin } from 'react-icons/fa';
import { TbBrandDingtalk } from 'react-icons/tb';


const communityLinks = {
  dingtalk: 'https://zvec.oss-cn-hongkong.aliyuncs.com/qrcode/dingding.png',
  discord: 'https://discord.gg/rKddFBBu9z',
  email: 'zvec@alibaba-inc.com',
  github: 'https://github.com/alibaba/zvec',
  wechat: 'https://zvec.oss-cn-hongkong.aliyuncs.com/qrcode/wechat.png',
};


const translations = {
  en: {
    tagline: 'Local retrieval infrastructure for applications, developer tools, and AI agents.',
    community: 'Community & contact',
    dingtalk: 'DingTalk QR code',
    discord: 'Join the Discord community',
    email: 'Email the Zvec team',
    github: 'Zvec on GitHub',
    wechat: 'WeChat QR code',
  },
  zh: {
    tagline: '面向应用、开发工具与 AI Agent 的本地检索基础设施。',
    community: '社区与联系',
    dingtalk: '钉钉群二维码',
    discord: '加入 Discord 社区',
    email: '联系 Zvec 团队',
    github: 'Zvec GitHub',
    wechat: '微信群二维码',
  },
};


export default function Footer({ lang }: { lang: string; }) {
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <footer className="zvec-footer">
      <div className="zvec-container">
        <div className="zvec-footer-main">
          <div className="zvec-footer-brand">
            <Image className="dark:hidden" src="/img/zvec-logo-light.svg" alt="Zvec" width={102} height={40} style={{ width: '102px', height: 'auto' }} />
            <Image className="hidden dark:block" src="/img/zvec-logo-dark.svg" alt="Zvec" width={102} height={40} style={{ width: '102px', height: 'auto' }} />
            <p>{t.tagline}</p>
          </div>
          <div className="zvec-footer-community">
            <span>{t.community}</span>
            <div className="zvec-socials" aria-label={t.community}>
              <a href={communityLinks.github} target="_blank" rel="noreferrer" aria-label={t.github} title={t.github}><FaGithub /></a>
              <a href={communityLinks.discord} target="_blank" rel="noreferrer" aria-label={t.discord} title={t.discord}><FaDiscord /></a>
              <a href={communityLinks.wechat} target="_blank" rel="noreferrer" aria-label={t.wechat} title={t.wechat}><FaWeixin /></a>
              <a href={communityLinks.dingtalk} target="_blank" rel="noreferrer" aria-label={t.dingtalk} title={t.dingtalk}><TbBrandDingtalk /></a>
              <a href={`mailto:${communityLinks.email}`} aria-label={t.email} title={t.email}><Mail /></a>
            </div>
          </div>
        </div>
        <div className="zvec-footer-bottom">
          <span>© {new Date().getFullYear()} Alibaba Group</span>
          <span>Apache License 2.0</span>
        </div>
      </div>
    </footer>
  );
}
