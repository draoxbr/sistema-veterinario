import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/src/components/SideBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campvet",
  description: "Sistema de Gestão Integrada de Clínicas Veterinárias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex text-purple-100 bg-[#090714] font-sans relative overflow-x-hidden">
        {/* Glow de fundo Roxo e Verde */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-900/30 rounded-full blur-[128px]" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-900/20 rounded-full blur-[128px]" />
        </div>

        <div className="relative z-10 flex w-full min-h-screen">
          <Sidebar />

          <main className="flex-1 p-8 overflow-y-auto min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}