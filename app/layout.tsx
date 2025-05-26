import { Nunito } from "next/font/google";
import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import { TicketCtxProvider } from "./context/ticket-context";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aiqfome - App de delivery",
  description: "Peça seu delivery no melhor app da sua cidade e região.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${nunito.variable} antialiased`}>
        <TicketCtxProvider>
          <Header />

          {/* HEADER_HEIGHT => 76px */}
          <main className="pt-[76px] min-h-dvh">{children}</main>

          <Footer />
        </TicketCtxProvider>
      </body>
    </html>
  );
}
