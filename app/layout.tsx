import 'antd/dist/reset.css';
import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import AntdProvider from '@/app/useClient';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
