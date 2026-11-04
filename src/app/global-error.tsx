"use client";

import "./globals.css";
import { TelaDeErro } from "@/components/TelaDeErro";

// Erro no layout principal (nem o cabeçalho carregou): a página inteira vira o aviso, em vez da tela branca.
export default function ErroGeral(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body>
        <TelaDeErro {...props} />
      </body>
    </html>
  );
}
