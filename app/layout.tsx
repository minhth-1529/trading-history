'use client'
import 'antd/dist/reset.css'
import './globals.css'
import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <ConfigProvider>
        <StyleProvider hashPriority="high">
      <html lang="en">
      <body className={inter.className}>
      {children}
      </body>
      </html>
        </StyleProvider>
      </ConfigProvider>
  );
}
