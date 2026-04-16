import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "INNOAIVATORS - TECHNOLOGIES",
  description: "INNOAIVATORS TECHNOLOGIES - Advanced Employee Management and Performance Tracking",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23ef4444' width='100' height='100' rx='20'/><circle cx='35' cy='30' r='10' fill='white'/><path d='M25 50 L45 50 L35 85 Z' fill='white'/><rect x='50' y='35' width='35' height='25' rx='2' fill='white'/><rect x='60' y='60' width='15' height='5' fill='white'/></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">{children}</body>
    </html>
  );
}
