import { AGENDA } from '@/data/agenda';

/** '#day-3' -> índice 2. Retorna null quando o hash não é um dia. */
export function dayFromHash(hash: string) {
  const match = /^#?day-(\d+)$/.exec(hash);
  if (!match) return null;
  const index = AGENDA.findIndex((d) => d.index === Number(match[1]));
  return index >= 0 ? index : null;
}

/** '#d3-country-uruguay' -> índice do dia que contém a sessão. */
export function dayFromSessionHash(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) return null;
  const index = AGENDA.findIndex((d) => d.sessions.some((s) => s.id === id));
  return index >= 0 ? index : null;
}

/**
 * Leva à sessão na representação que está visível: a grade proporcional no
 * desktop, a lista no restante.
 *
 * Nenhuma das duas carrega `id`, e isso é deliberado: com um id o navegador
 * faz seu próprio salto para o elemento antes de o React trocar de dia, e
 * disputa com esta rolagem — no desktop ele mirava o item recortado de um
 * pixel e parava no lugar errado.
 */
/**
 * Um link `#day-3` trocava o dia e deixava o leitor no topo da página, com o
 * painel abaixo da dobra e nenhum sinal de que algo aconteceu — vindo do
 * índice da semana, a chegada parecia uma troca de página qualquer. Rola até
 * as abas, que mostram qual dia está aberto logo acima do painel.
 */
export function scrollToDayPanel() {
  if (document.readyState !== 'complete') {
    addEventListener('load', () => scrollToDayPanel(), { once: true });
    return;
  }

  // `scroll-padding-top` no html já desconta o cabeçalho fixo.
  document.querySelector('.day-tabs')?.scrollIntoView({ block: 'start' });
}

export function scrollToSession(id: string) {
  // Rolar antes de a página terminar de carregar erra o alvo: a imagem do
  // hero ainda vai deslocar o layout abaixo dela.
  if (document.readyState !== 'complete') {
    addEventListener('load', () => scrollToSession(id), { once: true });
    return;
  }

  const grid = document.querySelector('.timeline');
  const gridVisible = grid !== null && getComputedStyle(grid).display !== 'none';

  // A sessão aparece em dois lugares. No desktop vale a que não está na lista
  // — pode ser um bloco da grade ou uma linha do bloco noturno, que fica fora
  // do eixo; no restante, vale a da lista.
  const candidates = [...document.querySelectorAll(`[data-session="${CSS.escape(id)}"]`)];
  const inList = (el: Element) => el.closest('.session-list') !== null;
  const target = gridVisible
    ? candidates.find((el) => !inList(el))
    : candidates.find(inList);
  if (!target) return;

  // Sem `behavior`: o CSS decide, e ele já troca para instantâneo sob
  // prefers-reduced-motion.
  target.scrollIntoView({ block: 'center' });
}
