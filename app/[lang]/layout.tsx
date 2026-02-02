import '../global.css';
import { Inter } from 'next/font/google';
import { Provider } from './provider';
import 'katex/dist/katex.css';


const inter = Inter({
  subsets: ['latin'],
});


export default async function Layout({
  params,
  children,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider params={params} >{children}</Provider>
      </body>
    </html>
  );
}
