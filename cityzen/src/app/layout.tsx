import "./globals.css";
import { Metadata } from "next";
import { ThemeWrapper } from "./styles/theme";
import Footer from "./components/Footer";

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
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeWrapper>
          <main className="w-full h-[100%]">{children}</main>
          {/* <Footer /> */}
        </ThemeWrapper>
      </body>
    </html>
  );
}