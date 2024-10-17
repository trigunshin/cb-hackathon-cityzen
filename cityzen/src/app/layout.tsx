import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import { ThemeWrapper } from "./styles/theme";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Metrall",
  description: "Metrall Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jaro:opsz@6..72&display=swap" rel="stylesheet" />
      </head>
      <ThemeWrapper>
      <body className={inter.className}>
        <main className="w-full h-full">{children}</main>
      </body>
      </ThemeWrapper>
    </html>
  );
}