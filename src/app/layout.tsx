import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BANDEIRAS } from "@/i18n/idiomas";
import { DICIONARIOS, idiomaAtual } from "@/i18n/servidor";
import { IdiomaProvider } from "@/i18n/cliente";

export const metadata: Metadata = {
  title: "Tababog Obras",
  description: "Gestão de obras, equipe, orçamento e fluxo de caixa",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  // iPhone: abre em tela cheia quando adicionado à tela inicial
  appleWebApp: { capable: true, title: "Tababog", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Azul da logo da Tababog
  themeColor: "#1b3f7d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const idioma = idiomaAtual();
  return (
    <html lang={BANDEIRAS[idioma].locale}>
      <body>
        <IdiomaProvider idioma={idioma} dicionario={DICIONARIOS[idioma]}>
          {children}
        </IdiomaProvider>
      </body>
    </html>
  );
}
