'use client';


import Image from 'next/image';


const openImageModal = (e: React.MouseEvent, imageUrl: string, titleText: string = "Image") => {
  e.preventDefault();

  const width = 400;
  const height = 500;
  const left = (window.innerWidth / 2) - (width / 2);
  const top = (window.innerHeight / 2) - (height / 2);

  const win = window.open(
    '',
    'ImageModal',
    `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars=yes`
  );

  if (win) {
    win.document.title = titleText;

    const img = win.document.createElement('img');
    img.src = imageUrl;
    img.alt = titleText;

    img.style.maxWidth = '90vw';
    img.style.maxHeight = '90vh';
    img.style.borderRadius = '8px';
    img.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';

    const container = win.document.createElement('div');
    container.style.cssText = `
      margin: 0;
      padding: 20px;
      background: #f5f5f5; /* Light background for light mode */
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: sans-serif;
    `;

    container.appendChild(img);
    win.document.body.appendChild(container);

    win.focus();
  }
};


const SvgIconLink = ({ href, svgContent, svgViewBox, label }: { href: string; svgContent: string; svgViewBox: string; label: string; }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ease-in-out transform hover:scale-110 inline-flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svgViewBox}
        width="24"
        height="24"
        className="w-6 h-6 hidden dark:block"
        aria-hidden="true"
        fill="#FFF"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svgViewBox}
        width="24"
        height="24"
        className="w-6 h-6 dark:hidden"
        aria-hidden="true"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      </svg>
    </a>
  );
};


const SvgIconButton = ({ href, svgContent, svgViewBox, label }: { href: string; svgContent: string; svgViewBox: string; label: string; }) => {
  return (
    <a
      href="#"
      onClick={(e) => openImageModal(e, href, label)}
      aria-label={label}
      title={label}
      className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 ease-in-out transform hover:scale-110 inline-flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svgViewBox}
        width="24"
        height="24"
        className="w-6 h-6 hidden dark:block"
        aria-hidden="true"
        fill="#FFF"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={svgViewBox}
        width="24"
        height="24"
        className="w-6 h-6 dark:hidden"
        aria-hidden="true"
      >
        <g dangerouslySetInnerHTML={{ __html: svgContent }} />
      </svg>
    </a>
  );
};


const icons = {
  dingtalk: {
    body: '<path fill="#4285F4" d="M1024 155.733C1024 70.4 953.6 0 868.267 0H155.733C70.4 0 0 70.4 0 155.733v712.534C0 953.6 70.4 1024 155.733 1024h712.534C953.6 1024 1024 953.6 1024 868.267V155.733z"/><path fill="#FFF" d="M810.667 422.4c-2.134 6.4-4.267 14.933-8.534 23.467C774.4 505.6 701.867 620.8 701.867 620.8l-21.334 36.267h102.4L588.8 915.2l44.8-174.933h-78.933l27.733-115.2c-23.467 6.4-49.067 12.8-81.067 23.466 0 0-42.666 25.6-121.6-46.933 0 0-53.333-46.933-23.466-59.733 12.8-4.267 64-10.667 104.533-17.067 55.467-6.4 87.467-10.667 87.467-10.667s-168.534 2.134-206.934-4.266c-40.533-6.4-89.6-72.534-100.266-132.267 0 0-17.067-32 36.266-17.067s268.8 59.734 268.8 59.734-281.6-87.467-300.8-108.8c-19.2-21.334-55.466-115.2-51.2-172.8 0 0 2.134-14.934 17.067-10.667 0 0 209.067 96 352 147.2 140.8 53.333 264.533 81.067 247.467 147.2z" /> ',
    viewBox: "0 0 1024 1024",
  },

  discord: {
    body: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.983 3l.123 .006c2.014 .214 3.527 .672 4.966 1.673a1 1 0 0 1 .371 .488c1.876 5.315 2.373 9.987 1.451 12.28c-1.003 2.005 -2.606 3.553 -4.394 3.553c-.732 0 -1.693 -.968 -2.328 -2.045a21.512 21.512 0 0 0 2.103 -.493a1 1 0 1 0 -.55 -1.924c-3.32 .95 -6.13 .95 -9.45 0a1 1 0 0 0 -.55 1.924c.717 .204 1.416 .37 2.103 .494c-.635 1.075 -1.596 2.044 -2.328 2.044c-1.788 0 -3.391 -1.548 -4.428 -3.629c-.888 -2.217 -.39 -6.89 1.485 -12.204a1 1 0 0 1 .371 -.488c1.439 -1.001 2.952 -1.459 4.966 -1.673a1 1 0 0 1 .935 .435l.063 .107l.651 1.285l.137 -.016a12.97 12.97 0 0 1 2.643 0l.134 .016l.65 -1.284a1 1 0 0 1 .754 -.54l.122 -.009zm-5.983 7a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15zm6 0a2 2 0 0 0 -1.977 1.697l-.018 .154l-.005 .149l.005 .15a2 2 0 1 0 1.995 -2.15z" />',
    viewBox: "0 0 24 24",
  },

  email: {
    body: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" /><path d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z" />',
    viewBox: "0 0 24 24",
  },

  github: {
    body: '<path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.315 2.1c.791 -.113 1.9 .145 3.333 .966l.272 .161l.16 .1l.397 -.083a13.3 13.3 0 0 1 4.59 -.08l.456 .08l.396 .083l.161 -.1c1.385 -.84 2.487 -1.17 3.322 -1.148l.164 .008l.147 .017l.076 .014l.05 .011l.144 .047a1 1 0 0 1 .53 .514a5.2 5.2 0 0 1 .397 2.91l-.047 .267l-.046 .196l.123 .163c.574 .795 .93 1.728 1.03 2.707l.023 .295l.007 .272c0 3.855 -1.659 5.883 -4.644 6.68l-.245 .061l-.132 .029l.014 .161l.008 .157l.004 .365l-.002 .213l-.003 3.834a1 1 0 0 1 -.883 .993l-.117 .007h-6a1 1 0 0 1 -.993 -.883l-.007 -.117v-.734c-1.818 .26 -3.03 -.424 -4.11 -1.878l-.535 -.766c-.28 -.396 -.455 -.579 -.589 -.644l-.048 -.019a1 1 0 0 1 .564 -1.918c.642 .188 1.074 .568 1.57 1.239l.538 .769c.76 1.079 1.36 1.459 2.609 1.191l.001 -.678l-.018 -.168a5.03 5.03 0 0 1 -.021 -.824l.017 -.185l.019 -.12l-.108 -.024c-2.976 -.71 -4.703 -2.573 -4.875 -6.139l-.01 -.31l-.004 -.292a5.6 5.6 0 0 1 .908 -3.051l.152 -.222l.122 -.163l-.045 -.196a5.2 5.2 0 0 1 .145 -2.642l.1 -.282l.106 -.253a1 1 0 0 1 .529 -.514l.144 -.047l.154 -.03z" />',
    viewBox: "0 0 24 24",
  },

  wechat: {
    body: '<title>WeChat</title><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>',
    viewBox: "0 0 24 24",
  }
}


const links = {
  dingtalk: 'https://dashvector-data.oss-cn-beijing.aliyuncs.com/zvec/qrcode/dingding.png',
  discord: 'https://discord.gg/rKddFBBu9z',
  email: 'zvec@alibaba-inc.com',
  fumadoc: 'https://fumadocs.dev/',
  github: 'https://github.com/alibaba/zvec/issues',
  wechat: 'https://dashvector-data.oss-cn-beijing.aliyuncs.com/zvec/qrcode/wechat.png',
};


const translations = {
  en: {
    copyright: '© {year} Alibaba Group. All rights reserved.',
    contactUs: 'Community',
    dingtalk: "DingTalk QR Code",
    discord: 'Join us on Discord',
    email: `Email ${links.email}`,
    fumadocs: 'This website is built with Fumadocs.',
    githubIssues: 'GitHub Issues',
    wechat: 'WeChat QR Code'
  },
  zh: {
    copyright: '© {year} Zvec, an open-source vector database by Alibaba Group',
    contactUs: '社区',
    dingtalk: "钉钉二维码",
    discord: 'Join us on Discord',
    email: `电子邮箱 ${links.email}`,
    fumadocs: 'This website is built with Fumadocs.',
    githubIssues: 'GitHub 问题反馈',
    wechat: '微信二维码'
  },
};


export default function Footer({ lang }: { lang: string }) {
  const t = translations[lang as keyof typeof translations] || translations.en;
  const currentYear = new Date().getFullYear();
  const copyrightText = t.copyright.replace('{year}', currentYear.toString());

  return (
    <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          {/* Logo Section */}
          <section className="flex-shrink-0">
            <div className="flex items-center justify-center md:justify-start">
              <Image
                src="/img/zvec-logo-light.svg"
                alt="Zvec Logo"
                width={100}
                height={40}
                priority
                className="dark:hidden"
              />
              <Image
                src="/img/zvec-logo-dark.svg"
                alt="Zvec Logo"
                width={100}
                height={40}
                priority
                className="hidden dark:block"
              />
            </div>
          </section>

          {/* Social Links Section */}
          <section aria-labelledby="social-links" className="flex flex-col items-center sm:items-center space-y-1">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-base">{t.contactUs}</span>
              <div className="flex space-x-2">
                <SvgIconLink
                  href={links.github}
                  svgContent={icons.github.body}
                  svgViewBox={icons.github.viewBox}
                  label={t.githubIssues}
                />
                <SvgIconLink
                  href={links.discord}
                  svgContent={icons.discord.body}
                  svgViewBox={icons.discord.viewBox}
                  label={t.discord}
                />
                <SvgIconButton
                  href={links.wechat}
                  svgContent={icons.wechat.body}
                  svgViewBox={icons.wechat.viewBox}
                  label={t.wechat}
                />
                <SvgIconButton
                  href={links.dingtalk}
                  svgContent={icons.dingtalk.body}
                  svgViewBox={icons.dingtalk.viewBox}
                  label={t.dingtalk}
                />
                <SvgIconLink
                  href={`mailto:${links.email}`}
                  svgContent={icons.email.body}
                  svgViewBox={icons.email.viewBox}
                  label={t.email}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>

        <section className="flex flex-col md:flex-row justify-between items-center gap-4 text-center text-sm text-gray-500 dark:text-gray-400" aria-label="Footer Information">
          <div>{copyrightText}</div>
          <div>
            <a
              href={links.fumadoc}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {t.fumadocs}
            </a>
          </div>
        </section>
      </div>
    </footer >
  );
}