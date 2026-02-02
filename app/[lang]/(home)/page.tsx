import Apps from '@/components/AppList';
import CodeDemo from '@/components/CodeDemo';
import FeatureCards from '@/components/FeatureCards';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PerformanceDemo from '@/components/PerformanceDemo';
import { i18n } from '@/lib/i18n';


export async function generateStaticParams() {
  return i18n.languages.map((language) => ({ lang: language }));
}


const MainBackground = () => {
  return (
    <div className="
        absolute inset-0 -z-10 overflow-hidden
        dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Top-left glow */}
      <div className="
          absolute -top-[0vh] -left-[15vw] w-[30vw] h-[30vh]
          bg-gradient-to-tr
          from-purple-100/20 to-pink-200/50
          dark:from-purple-900/30 dark:to-pink-900/30
          rounded-br-[40%] rounded-tr-none rounded-bl-none rounded-tl-none
          blur-3xl"
      ></div>
      {/* Middle-right glow */}
      <div className="
          absolute top-[40vh] -right-[25vw] w-[35vw] h-[80vh]
          bg-gradient-to-br
          from-teal-200/30 to-blue-300/30
          dark:from-slate-600/20 dark:via-emerald-600/30 dark:to-teal-800/30
          rounded-tl-[40%] rounded-bl-[40%]
          blur-3xl"
      ></div>
    </div>
  );
};


export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <main>
      <section className="relative w-full overflow-hidden">
        <MainBackground />
        <div className="relative z-10">
          <Hero lang={lang} fontFamily="Inter" />
          <FeatureCards lang={lang} />
        </div>
      </section>
      <section className="
        relative w-full overflow-hidden
        bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
      >
        <CodeDemo lang={lang} />
        <PerformanceDemo lang={lang} />
        <Apps />
      </section>
      <Footer lang={lang} />
    </main >
  );
}