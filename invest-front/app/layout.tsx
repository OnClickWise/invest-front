import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import "./globals.css";

// Configura a fonte Inter
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InvestPro SaaS",
  description: "Gestão de Investimentos Profissional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}