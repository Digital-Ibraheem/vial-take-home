import type { Metadata } from "next";
import { ColorSchemeScript } from '@mantine/core';
import { ThemeProvider } from '../components/ThemeProvider';
import '@mantine/core/styles.css';
import './globals.css';

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
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
