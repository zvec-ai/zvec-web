import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found — Zvec',
  robots: 'noindex',
};

export default function NotFound() {
  return (
    <>
      <head>
        <meta httpEquiv="refresh" content="8;url=/en/docs/db/" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes countdown {
                from { width: 100%; }
                to { width: 0%; }
              }
            `,
          }}
        />
      </head>
      <div
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)',
          color: '#111',
        }}
      >
        <div
          style={{
            maxWidth: 440,
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <img
            src="/img/zvec-logo-light.svg"
            alt="Zvec"
            style={{
              height: 64,
              marginBottom: '1.5rem',
              display: 'inline-block',
            }}
          />
          <div
            style={{
              fontSize: '4rem',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              color: '#ddd',
              marginBottom: '0.5rem',
            }}
          >
            404
          </div>
          <h1
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              color: '#666',
              lineHeight: 1.7,
              marginBottom: '2rem',
              fontSize: '0.95rem',
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. You&apos;ll be redirected to the docs in a few seconds.
          </p>
          <a
            id="docs-link"
            href="/en/docs/db/"
            style={{
              display: 'inline-block',
              padding: '0.7rem 1.8rem',
              background: '#111',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 500,
              fontSize: '0.9rem',
              transition: 'transform 0.15s, box-shadow 0.15s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            Go to Documentation
          </a>
          <div
            style={{
              marginTop: '2rem',
              width: '100%',
              height: 3,
              background: '#e5e5e5',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#111',
                animation: 'countdown 8s linear forwards',
              }}
            />
          </div>
          <p
            style={{
              marginTop: '0.75rem',
              fontSize: '0.8rem',
              color: '#999',
            }}
          >
            Redirecting automatically…
          </p>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            var lang = (navigator.language || navigator.userLanguage || 'en').startsWith('zh') ? 'zh' : 'en';
            var target = '/' + lang + '/docs/db/';
            document.querySelectorAll('a[href="/en/docs/db/"]').forEach(function(el){ el.href = target; });
            setTimeout(function(){ window.location.replace(target); }, 8000);
          `,
        }}
      />
    </>
  );
}
