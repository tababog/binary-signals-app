/**
 * Lançamento de recibos — roda no Google, não no PC.
 *
 * Substitui o lancar-recibos.ps1, que exigia Windows com Excel aberto.
 * Este script fica preso à Planilha Google da casa e um gatilho de horário
 * do Google o executa. Notebook desligado, celular na mão: tanto faz.
 *
 * Como funciona: você (ou o Claude) escreve a linha na aba "A LANCAR".
 * No horário do gatilho — ou quando você aperta o botão no menu — o script
 * valida, joga na aba Lançamentos, acha a foto em recibos/novos, renomeia,
 * move para recibos/lancados e põe o link na coluna Recibo.
 *
 * O script NÃO lê o recibo. Ler a foto e decidir a categoria é julgamento,
 * e isso continua sendo seu ou meu. O script faz a parte mecânica, que é
 * justamente a que te obrigava a ligar o PC.
 */

const CFG = {
  casa: '1104 Agnew',
  abaLanc: 'Lançamentos',
  abaCat: 'Categorias',
  abaPend: 'A LANCAR',
  // pastas do Drive desta casa (ids da pasta recibos)
  idNovos: '1OD3nIsSLyUXMtiRzXsMD_7dHckPwPJMf',
  idLancados: '1Nm-_63RHS-6ZGiQjjHRNFn1NAqwaFNr6',
  // colunas da aba Lançamentos, 1-based
  col: { data: 1, mes: 2, grupo: 3, categoria: 4, descricao: 5,
         valor: 6, tipo: 7, obs: 8, recibo: 9 },
};

/** Menu próprio, para lançar na hora sem esperar o gatilho. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Recibos')
    .addItem('Lançar o que está em A LANCAR', 'lancarPendentes')
    .addItem('Instalar gatilho diário (22h)', 'criarGatilho')
    .addToUi();
}

function criarGatilho() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'lancarPendentes')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('lancarPendentes').timeBased().atHour(22).everyDays(1).create();
  SpreadsheetApp.getActive().toast('Gatilho das 22h instalado.');
}

/** Categorias válidas → grupo e tipo, lidos da aba Categorias. */
function lerCategorias_(ss) {
  const sh = ss.getSheetByName(CFG.abaCat);
  if (!sh) throw new Error('Aba "' + CFG.abaCat + '" não encontrada.');
  const v = sh.getDataRange().getValues();
  let cab = -1;
  for (let i = 0; i < v.length; i++) {
    if (String(v[i][0]).trim() === 'Categoria') { cab = i; break; }
  }
  if (cab < 0) throw new Error('Não achei o cabeçalho "Categoria" na aba Categorias.');
  const mapa = {};
  for (let i = cab + 1; i < v.length; i++) {
    const nome = String(v[i][0]).trim();
    if (!nome) continue;
    mapa[nome.toUpperCase()] = { nome: nome, tipo: String(v[i][1]).trim(), grupo: String(v[i][2]).trim() };
  }
  return mapa;
}

/** Última linha com data preenchida na aba Lançamentos. */
function ultimaLinha_(sh) {
  const col = sh.getRange(1, CFG.col.data, sh.getMaxRows(), 1).getValues();
  for (let i = col.length - 1; i >= 0; i--) {
    if (col[i][0] !== '' && col[i][0] !== null) return i + 1;
  }
  return 1;
}

/** Já existe lançamento com a mesma data e o mesmo valor? */
function possivelDuplicado_(sh, fim, data, valor) {
  if (fim < 2) return false;
  const v = sh.getRange(2, 1, fim - 1, CFG.col.valor).getValues();
  const alvo = Utilities.formatDate(data, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  for (const r of v) {
    const d = r[CFG.col.data - 1];
    if (!(d instanceof Date)) continue;
    if (Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') !== alvo) continue;
    if (Math.abs(Number(r[CFG.col.valor - 1]) - valor) < 0.005) return true;
  }
  return false;
}

/** Acha a foto por nome em recibos/novos. Devolve null se não houver nome. */
function acharFoto_(nome) {
  if (!nome) return null;
  const it = DriveApp.getFolderById(CFG.idNovos).getFilesByName(nome);
  if (!it.hasNext()) throw new Error('foto "' + nome + '" não está em recibos/novos');
  return it.next();
}

/** Renomeia AAAA-MM-DD_valor_original e move para lancados. */
function arquivarFoto_(arq, data, valor) {
  const d = Utilities.formatDate(data, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const v = Number(valor).toFixed(2);
  arq.setName(d + '_' + v + '_' + arq.getName());
  DriveApp.getFolderById(CFG.idLancados).addFile(arq);
  DriveApp.getFolderById(CFG.idNovos).removeFile(arq);
  return arq.getUrl();
}

function lancarPendentes() {
  const ss = SpreadsheetApp.getActive();
  const pend = ss.getSheetByName(CFG.abaPend);
  if (!pend) throw new Error('Crie a aba "' + CFG.abaPend + '" com o cabeçalho: Data | Categoria | Descrição | Valor | Obs | Foto | Situação');
  const lanc = ss.getSheetByName(CFG.abaLanc);
  if (!lanc) throw new Error('Aba "' + CFG.abaLanc + '" não encontrada.');

  const cats = lerCategorias_(ss);
  const v = pend.getDataRange().getValues();
  let feitos = 0, parados = 0;

  for (let i = 1; i < v.length; i++) {
    const [data, categoria, descricao, valor, obs, foto, situacao] = v[i];
    if (!data && !categoria && !valor) continue;
    if (String(situacao).trim().toLowerCase() === 'lancado') continue;

    const erro = t => { pend.getRange(i + 1, 7).setValue('ERRO: ' + t); parados++; };

    try {
      if (!(data instanceof Date)) throw new Error('data inválida (use uma data de verdade, não texto)');
      const n = Number(valor);
      if (!(n > 0)) throw new Error('valor tem de ser maior que zero');
      const c = cats[String(categoria).trim().toUpperCase()];
      if (!c) throw new Error('categoria "' + categoria + '" não existe na aba Categorias');

      const fim = ultimaLinha_(lanc);
      if (possivelDuplicado_(lanc, fim, data, n)) {
        throw new Error('possível duplicado: já há lançamento com esta data e este valor');
      }

      // acha a foto ANTES de escrever, para não deixar linha órfã
      const arq = acharFoto_(foto ? String(foto).trim() : '');

      const alvo = fim + 1;
      lanc.getRange(alvo, CFG.col.data).setValue(data);
      lanc.getRange(alvo, CFG.col.categoria).setValue(c.nome);
      lanc.getRange(alvo, CFG.col.descricao).setValue(descricao || '');
      lanc.getRange(alvo, CFG.col.valor).setValue(n);
      lanc.getRange(alvo, CFG.col.obs).setValue(obs || '');

      // Mês, Grupo e Tipo: se a planilha tiver ARRAYFORMULA na coluna, não
      // encoste. Se não tiver, o script preenche para a linha não ficar vazia.
      if (!lanc.getRange(alvo, CFG.col.mes).getFormula()) {
        lanc.getRange(alvo, CFG.col.mes)
            .setValue(Utilities.formatDate(data, Session.getScriptTimeZone(), 'MMM/yy'));
        lanc.getRange(alvo, CFG.col.grupo).setValue(c.grupo);
        lanc.getRange(alvo, CFG.col.tipo).setValue(c.tipo);
      }

      if (arq) {
        const url = arquivarFoto_(arq, data, n);
        lanc.getRange(alvo, CFG.col.recibo).setFormula('=HYPERLINK("' + url + '";"recibo")');
      }

      pend.getRange(i + 1, 7).setValue('lancado');
      feitos++;
    } catch (e) {
      erro(e.message);
    }
  }

  const msg = feitos + ' lançado(s), ' + parados + ' parado(s) com erro.';
  try { ss.toast(msg); } catch (e) {}
  if (parados) {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
      'Recibos ' + CFG.casa + ': ' + parados + ' parado(s)',
      msg + '\n\nVeja a coluna Situação da aba ' + CFG.abaPend + '.');
  }
  return msg;
}
