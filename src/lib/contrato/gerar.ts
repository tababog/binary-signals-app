import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from "pdf-lib";
import { EMPRESA } from "../empresa";
import { LOGO_PNG_BASE64 } from "./logo";

/**
 * Contrato de home improvement em PDF (inglês, regra 9) com campos editáveis, a partir do contrato padrão da Tababog.
 * Inclui o que o Home Improvement Act de CT exige: data da transação, nome/endereço/registro HIC do contratante,
 * datas de início e término, assinaturas e o direito de cancelamento em 3 dias úteis com o formulário
 * "Notice of Cancellation" anexo (em duas vias). Revisar o texto com um advogado de CT.
 */

export type DadosContrato = {
  data: string; // data da transação, MM/DD/YYYY
  cancelarAte: string; // fim do prazo de cancelamento, MM/DD/YYYY
  cliente: { nome: string; endereco: string; contato: string };
  projeto: string;
  escopo: string;
  naoIncluso: string;
  precoCent: number;
  precoExtenso: string;
  pagamento: string;
  inicio: string;
  termino: string;
};

const LARGURA = 612;
const ALTURA = 792;
const MARGEM = 54;
const AREA = LARGURA - 2 * MARGEM;
const AZUL = rgb(0.106, 0.247, 0.49);
const CINZA = rgb(0.35, 0.35, 0.35);
const FUNDO_CAMPO = rgb(0.93, 0.96, 1);

/** Data MM/DD/YYYY + n dias úteis (em CT, "business day" exclui domingos e feriados; aqui só domingos). */
export function maisDiasUteis(data: Date, n: number) {
  const d = new Date(data);
  let contados = 0;
  while (contados < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) contados++;
  }
  return d;
}

export function dataEUA(d: Date | null | undefined) {
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric", timeZone: "America/New_York" });
}

const dolar = (c: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(c / 100);

class Escritor {
  pagina!: PDFPage;
  y = 0;
  private n = 0;
  constructor(private doc: PDFDocument, private fonte: PDFFont, private negrito: PDFFont) {
    this.novaPagina();
  }
  novaPagina() {
    this.pagina = this.doc.addPage([LARGURA, ALTURA]);
    this.y = ALTURA - MARGEM;
  }
  espaco(altura: number) {
    if (this.y - altura < MARGEM) this.novaPagina();
  }
  /** Quebra o texto em linhas que cabem na largura. */
  linhas(texto: string, tamanho: number, fonte = this.fonte, largura = AREA) {
    const saida: string[] = [];
    for (const paragrafo of texto.split("\n")) {
      let linha = "";
      for (const palavra of paragrafo.split(" ")) {
        const teste = linha ? `${linha} ${palavra}` : palavra;
        if (fonte.widthOfTextAtSize(teste, tamanho) > largura && linha) {
          saida.push(linha);
          linha = palavra;
        } else linha = teste;
      }
      saida.push(linha);
    }
    return saida;
  }
  texto(texto: string, { tamanho = 10, negrito = false, cor = rgb(0, 0, 0), depois = 4, x = MARGEM, largura = AREA } = {}) {
    const fonte = negrito ? this.negrito : this.fonte;
    for (const l of this.linhas(texto, tamanho, fonte, largura)) {
      this.espaco(tamanho + 3);
      this.pagina.drawText(l, { x, y: this.y - tamanho, size: tamanho, font: fonte, color: cor });
      this.y -= tamanho + 3;
    }
    this.y -= depois;
  }
  titulo(texto: string) {
    this.espaco(30);
    this.y -= 6;
    this.texto(texto, { tamanho: 11, negrito: true, cor: AZUL, depois: 3 });
  }
  /** Campo editável do PDF (texto pré-preenchido que o cliente ou a Tababog pode mudar antes de assinar). */
  campo(nome: string, valor: string, { rotulo, linhas = 1, tamanho = 10, largura = AREA, x = MARGEM } = {} as { rotulo?: string; linhas?: number; tamanho?: number; largura?: number; x?: number }) {
    if (rotulo) this.texto(rotulo, { tamanho: 8, cor: CINZA, depois: 1, x, largura });
    const altura = Math.max(1, linhas) * (tamanho + 3) + 6;
    this.espaco(altura);
    const form = this.doc.getForm();
    const f = form.createTextField(`${nome}_${++this.n}`);
    if (linhas > 1) f.enableMultiline();
    f.setText(valor);
    f.addToPage(this.pagina, { x, y: this.y - altura, width: largura, height: altura, font: this.fonte, backgroundColor: FUNDO_CAMPO, borderWidth: 0 });
    f.setFontSize(tamanho);
    this.y -= altura + 6;
  }
  /** Linha para assinar à mão, com o nome e a data em campos editáveis embaixo. */
  assinatura(rotulo: string, nome: string, data: string) {
    this.espaco(96);
    this.y -= 30;
    const largNome = AREA * 0.6;
    this.pagina.drawLine({ start: { x: MARGEM, y: this.y }, end: { x: MARGEM + largNome, y: this.y }, thickness: 0.8 });
    this.y -= 2;
    this.texto(rotulo, { tamanho: 8, cor: CINZA, depois: 2 });
    const y0 = this.y;
    this.campo("nome", nome, { rotulo: "Printed name", largura: largNome, tamanho: 9 });
    const y1 = this.y;
    this.y = y0;
    this.campo("data_assinatura", data, { rotulo: "Date", largura: AREA - largNome - 16, x: MARGEM + largNome + 16, tamanho: 9 });
    this.y = Math.min(y1, this.y);
  }
}

function cabecalho(e: Escritor, logo: Awaited<ReturnType<PDFDocument["embedPng"]>>, negrito: PDFFont, fonte: PDFFont, titulo: string) {
  const p = e.pagina;
  p.drawImage(logo, { x: MARGEM, y: ALTURA - MARGEM - 64, width: 64, height: 64 });
  p.drawText(titulo, { x: MARGEM + 78, y: ALTURA - MARGEM - 22, size: 17, font: negrito, color: AZUL });
  const info = [EMPRESA.nome, EMPRESA.endereco, `${EMPRESA.telefone}  ·  CT Home Improvement Contractor Reg. ${EMPRESA.hic}`];
  info.forEach((l, i) => p.drawText(l, { x: MARGEM + 78, y: ALTURA - MARGEM - 38 - i * 11, size: 8.5, font: i ? fonte : negrito, color: CINZA }));
  p.drawLine({ start: { x: MARGEM, y: ALTURA - MARGEM - 74 }, end: { x: LARGURA - MARGEM, y: ALTURA - MARGEM - 74 }, thickness: 1.2, color: AZUL });
  e.y = ALTURA - MARGEM - 88;
}

function avisoCancelamento(e: Escritor, d: DadosContrato, via: string) {
  e.titulo(`NOTICE OF CANCELLATION  (${via})`);
  e.campo("data_transacao", d.data, { rotulo: "Date of transaction", largura: 160 });
  e.texto(
    "You may cancel this transaction, without any penalty or obligation, within three business days from the above date.\n" +
      "If you cancel, any property traded in, any payments made by you under the contract or sale, and any negotiable instrument executed by you will be returned within ten business days following receipt by the seller of your cancellation notice, and any security interest arising out of the transaction will be cancelled.\n" +
      "If you cancel, you must make available to the seller at your residence, in substantially as good condition as when received, any goods delivered to you under this contract or sale; or you may, if you wish, comply with the instructions of the seller regarding the return shipment of the goods at the seller's expense and risk.\n" +
      "If you do make the goods available to the seller and the seller does not pick them up within twenty days of the date of your notice of cancellation, you may retain or dispose of them without any further obligation. If you fail to make the goods available to the seller, or if you agree to return the goods to the seller and fail to do so, then you remain liable for performance of all obligations under the contract.",
    { tamanho: 9 },
  );
  e.texto(`To cancel this transaction, mail or deliver a signed and dated copy of this cancellation notice, or any other written notice, to ${EMPRESA.nome}, ${EMPRESA.endereco}, not later than midnight of:`, { tamanho: 9, depois: 2 });
  e.campo("cancelar_ate", d.cancelarAte, { largura: 160 });
  e.texto("I hereby cancel this transaction.", { tamanho: 9, negrito: true });
  e.assinatura("Buyer's signature", d.cliente.nome, "");
}

export async function gerarContratoPDF(d: DadosContrato) {
  const doc = await PDFDocument.create();
  doc.setTitle(`Home Improvement Contract - ${d.cliente.nome}`);
  doc.setAuthor(EMPRESA.nome);
  const fonte = await doc.embedFont(StandardFonts.Helvetica);
  const negrito = await doc.embedFont(StandardFonts.HelveticaBold);
  const logo = await doc.embedPng(Buffer.from(LOGO_PNG_BASE64, "base64"));
  const e = new Escritor(doc, fonte, negrito);

  cabecalho(e, logo, negrito, fonte, "HOME IMPROVEMENT CONTRACT");
  e.campo("data", d.data, { rotulo: "Date of transaction", largura: 160 });
  e.texto(`Contractor: ${EMPRESA.nome}, ${EMPRESA.endereco}, ${EMPRESA.telefone}, Connecticut Home Improvement Contractor Registration No. ${EMPRESA.hic}.`, { tamanho: 10 });
  e.campo("cliente", d.cliente.nome, { rotulo: "Homeowner / Customer" });
  e.campo("endereco", d.cliente.endereco, { rotulo: "Project address" });
  e.campo("contato", d.cliente.contato, { rotulo: "Phone / e-mail" });
  e.texto("The Contractor agrees to furnish the labor and materials described below in order to complete the following project:", { tamanho: 10 });
  e.campo("projeto", d.projeto, { rotulo: "RE (project)" });

  e.titulo("1. JOB DESCRIPTION");
  e.campo("escopo", d.escopo, { linhas: Math.min(26, Math.max(6, d.escopo.split("\n").length + 2)) });
  e.campo("nao_incluso", d.naoIncluso, { rotulo: "Not included in this contract", linhas: 2 });

  e.titulo("2. CONTRACT PRICE AND PAYMENT TERMS");
  e.texto("In exchange for the specified work, the Homeowner agrees to pay the Contractor:", { tamanho: 10, depois: 2 });
  e.campo("preco", dolar(d.precoCent), { rotulo: "Total contract price (USD)", largura: 200 });
  e.campo("preco_extenso", d.precoExtenso, { rotulo: "Amount in words" });
  e.campo("pagamento", d.pagamento, { rotulo: "Payment schedule", linhas: 3 });

  e.titulo("3. TIME OF PERFORMANCE");
  const yDatas = e.y;
  e.campo("inicio", d.inicio, { rotulo: "Work shall begin on", largura: 200 });
  const yFim = e.y;
  e.y = yDatas;
  e.campo("termino", d.termino, { rotulo: "Work shall be completed by", largura: 200, x: MARGEM + 230 });
  e.y = Math.min(yFim, e.y);
  e.texto("Time is of the essence.", { tamanho: 10 });

  e.titulo("4. INDEPENDENT CONTRACTOR STATUS");
  e.texto(
    "It is agreed that the Contractor shall perform the specified work as an independent contractor. The Contractor maintains its own independent business, shall use its own tools and equipment, and shall perform the specified work independent of the Homeowner's supervision, being responsible only for satisfactory completion of the work.",
  );
  e.titulo("5. LICENSE / REGISTRATION");
  e.texto(`The Contractor shall comply with all state and local licensing and registration requirements for the type of activity involved in the specified work. Connecticut Home Improvement Contractor Registration No. ${EMPRESA.hic}.`);
  e.titulo("6. LIABILITY WAIVER");
  e.texto("If the Contractor is injured in the course of performing the specified work, the Homeowner shall be exempt from liability for those injuries to the fullest extent allowed by law.");
  e.titulo("7. PERMITS AND APPROVALS");
  e.texto(
    "The Homeowner shall be responsible for determining which permits are necessary, for obtaining the permits and for paying all state and local permit fees necessary for performing the specified work, unless stated otherwise in the job description. The Homeowner shall be responsible for obtaining approval from the local homeowners' association, if required.",
  );
  e.titulo("8. ENTIRE AGREEMENT AND CHANGES");
  e.texto("This contract contains the entire agreement between the Homeowner and the Contractor related to the specified work. Any change or modification to this contract shall be in writing and signed by both parties.");

  e.espaco(60);
  e.y -= 6;
  e.texto(
    "YOU, THE BUYER, MAY CANCEL THIS TRANSACTION AT ANY TIME PRIOR TO MIDNIGHT OF THE THIRD BUSINESS DAY AFTER THE DATE OF THIS TRANSACTION. SEE THE ATTACHED NOTICE OF CANCELLATION FORM FOR AN EXPLANATION OF THIS RIGHT.",
    { tamanho: 10, negrito: true },
  );
  e.assinatura("Homeowner signature", d.cliente.nome, d.data);
  e.assinatura(`Contractor signature - ${EMPRESA.nome}`, EMPRESA.responsavel, d.data);

  // Formulário de cancelamento em duas vias, cada uma na sua página (uma fica com o cliente)
  for (const via of ["Customer copy", "Contractor copy"]) {
    e.novaPagina();
    cabecalho(e, logo, negrito, fonte, "NOTICE OF CANCELLATION");
    avisoCancelamento(e, d, via);
  }

  doc.getForm().updateFieldAppearances(fonte);
  return doc.save();
}
