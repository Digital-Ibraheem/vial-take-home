import type { Metadata } from "next";
import { ColorSchemeScript } from '@mantine/core';
import { ThemeProvider } from '../components/ThemeProvider';
import { Inter } from 'next/font/google';
import '@mantine/core/styles.css';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Query Management",
  description: "Manage queries and form data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
