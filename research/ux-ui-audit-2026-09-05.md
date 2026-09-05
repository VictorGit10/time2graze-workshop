# Auditoria UX/UI — Time2Graze Brazil Workshop

5 de setembro de 2026. Análise da versão local existente, incluindo alterações ainda não commitadas. Nenhuma alteração de interface foi feita nesta auditoria.

## Conclusão

A identidade visual tem coerência e o site já tem fundamentos úteis: navegação persistente, agenda adaptada em lista no celular, dados centralizados, fotografias reais e indicação de pendências. O salto de qualidade depende de organizar a interface em torno das tarefas do participante: encontrar sua sessão, chegar ao hotel, localizar o transporte e acessar um arquivo.

Hoje essas tarefas exigem transitar entre blocos que separam informações e ações sobre o mesmo assunto. O hotel recomenda Uber, mas seu botão está em outro painel; a agenda conhece o local e os requisitos, mas não os apresenta; os materiais levam à sessão, mas a sessão não oferece o caminho de volta. Encurtar esses percursos deve preceder qualquer mudança ornamental.

## Método e limites

- Inspeção do código das quatro páginas, navegação, agenda, locais, calendário e estilos responsivos.
- Navegador real com viewports de 375 × 812, 390 × 844, 768 × 1024 e 1440 × 900. As quatro páginas foram observadas a 375 px; Practical foi também inspecionada nas outras larguras. Não foi executada uma matriz completa de todas as páginas em todas as larguras.
- Percurso real do cartão do hotel ao painel, recarregamento do link, abertura direta do Dia 5, leitura da árvore de acessibilidade e medição de geometria do DOM.
- Medidas aproximadas em CSS pixels, após carregamento, no servidor de desenvolvimento. Não são métricas da publicação em produção nem resultados de testes com participantes. Altura varia com fonte, viewport e conteúdo selecionado.
- Não foi solicitada corrida, enviada mensagem ou alterada publicação. A abertura efetiva do aplicativo Uber em iOS/Android, impressão paginada, navegação offline, zoom de texto e uso com leitor de tela ainda precisam de testes específicos.
- A documentação do projeto contém descrições de versões anteriores. Os achados abaixo usam o código e a interface atuais; por exemplo, existem três locais no registro atual e o calendário está em beta.

## Evidências medidas

| Observação | Resultado local | Consequência |
| --- | --- | --- |
| Menu principal a 375 px | Último link termina em x ≈ 407 px; o gradiente esmaece sua extremidade | Practical information não aparece inteiro, inclusive quando é a página ativa |
| Practical a 375 px | Cabeçalho ≈ 100 px; primeiro cartão em y ≈ 497 px | A abertura consome muito espaço antes de uma ação de deslocamento |
| Practical a 375 px | Maps começa em y ≈ 2.012 px; painel em ≈ 2.249 px | Quem procura um local por rolagem precisa atravessar hotel e transporte |
| Practical a 375 px | Primeiras ações do LAPIG em y ≈ 2.546 px; página ≈ 4.733 px | A função de localização fica a mais de três alturas de viewport do topo |
| Link do hotel a 375 px | Seleciona Golden Lis e leva a #map-panel; Uber fica visível após o salto | O atalho funciona, mas depende de o participante descobrir um link intermediário |
| Recarregar o link do hotel | #map-panel permanece; local volta para LAPIG; Uber desaparece | A URL não identifica o destino que o participante acabou de escolher |
| Practical a 390 px | Maps em ≈ 1.965 px; ações em ≈ 2.498 px; menu termina em x ≈ 407 px | O problema persiste numa largura comum de celular |
| Practical a 768 px | Seletor ≈ 270 px, painel ≈ 435 px, mídia ≈ 521 px de altura | Layout intermediário dedica espaço a seleção e mídia antes da ação |
| Practical a 1440 px | Maps em ≈ 1.156 px; ações em ≈ 2.053 px | O desktop também mantém uma distância excessiva entre chegada à página e ação |
| Programme a 375 px | Primeira sessão começa em y ≈ 715 px | Título, relógio, abas e resumo repetido ocupam quase toda a abertura |
| Link #day-5 a 375 px | Dia 5 abre; sua aba permanece entre x ≈ 665–825 px, com scroll horizontal zero | O conteúdo muda, mas a seleção ativa fica invisível |
| Materials a 375 px | ≈ 4.852 px de altura; grupo do Dia 5 em ≈ 3.954 px | Falta acesso direto aos dias inferiores |
| Home a 375 px | Ação Programme em ≈ 532 px; diretório em ≈ 931 px; cartão Practical em ≈ 1.198 px | Programme é acessível cedo; logística depende do menu parcialmente cortado ou de mais rolagem |

Rolagem não é defeito por si só. Aqui o problema é a combinação de distância, opções escondidas, prioridade visual e ausência de atalhos associados à tarefa.

## 1. Prioridade alta: navegação global

**Evidência:** `components/site-header.tsx:11` e `app/globals.css:542`. Quatro destinos existem, mas o último ultrapassa a largura disponível e tem sua borda apagada por uma máscara. Barra de rolagem oculta e rótulo longo reduzem a percepção de que há algo acessível à direita.

**Recomendação:** manter quatro destinos, reorganizados como `Home · Programme · Travel · Materials`. Usar `Travel & stay` como título da página operacional, preservando `/practical/` e seus links existentes. Travel é uma proposta de rótulo a validar com participantes; o critério é que consigam associá-lo a hotel, transporte e locais sem ajuda.

Exibir as quatro opções inteiras, sem rolagem horizontal obrigatória, usando distribuição de espaço, rótulos curtos e quebra controlada quando necessária. Não reduzir a fonte para fazer caber. O estado ativo deve estar visível na entrada e após links entre páginas.

**Por que não uma quinta página agora:** separar Maps de Practical produziria dois lugares possíveis para procurar hotel e deslocamento. Existem somente três locais cadastrados; uma lista direta resolve sua descoberta sem nova rota. Uma quinta página só se justificaria se testes mostrassem uma tarefa distinta, recorrente e mal atendida por Travel. A abertura do usuário a novas abas foi considerada; quatro é recomendação de arquitetura para o conteúdo atual, não um impedimento imposto pela regra antiga.

## 2. Prioridade alta: hotel e deslocamento na primeira tela

**Evidência:** `app/practical/page.tsx:103` recomenda uma viagem, mas oferece apenas “View hotel map and arrival options”. A ação concreta está no painel posterior. A página começa com título, subtítulo institucional, estado geral e cartão amplo. A combinação de “Arranged”, pagamento coberto e pedido para confirmar cobertura cria incerteza sobre o que já se pode considerar válido.

**Recomendação:** abrir Travel com título compacto, índice visível de seções e o hotel. O nome e a finalidade devem anteceder um botão principal `Open Uber to hotel`, seguido de `Directions`, `Copy address` e `Call hotel`. O destino precisa estar explícito mesmo quando o botão for visto isoladamente. São ações de abrir aplicativos ou copiar informações; a corrida continua sendo solicitada pelo participante no Uber.

Logo abaixo, datas e cobertura com seu estado exato. Separar “hotel identificado” de “cobertura da hospedagem aguardando confirmação”. Substituir pedidos ambíguos como “Please confirm” por um estado editorial objetivo até existir responsável e canal de contato. Não prometer nova confirmação, prazo ou contato não fornecido.

No topo, um índice em duas linhas, sem rolagem horizontal: `Hotel`, `Shuttle`, `Venues`, `Meals`, `Help`. São âncoras de conteúdo, não abas que ocultam blocos. O índice precisa caber antes do cartão sem atrasar o primeiro botão para além da primeira tela. Depois de rolar, um acesso discreto “On this page” pode recuperar esse índice se os testes demonstrarem necessidade; evitar empilhar cabeçalhos fixos desde o início.

**Critério:** a 375 × 812, nome do hotel e botão Uber visíveis na abertura de Travel; a partir do menu global, dois toques para chegar à abertura do Uber, sem seletor intermediário. Esse número é uma meta do novo fluxo, não um ganho já medido.

## 3. Prioridade alta: locais independentes e compartilháveis

**Evidência:** `PlaceLink` usa o mesmo `#map-panel` para destinos diferentes e `activeMap` começa em zero (`app/practical/page.tsx:32–51`). Recarregar a seleção do hotel retorna a LAPIG. No celular o seletor mostra apenas um nome, sem expor as outras opções e seus usos.

**Recomendação:** eliminar o seletor como porta obrigatória de acesso. Hospedagem fica no bloco do hotel; LAPIG e Cidade de Goiás aparecem em blocos nomeados e compactos, acessíveis por âncoras estáveis como `#hotel`, `#lapig` e `#cidade-de-goias`. Não repetir um segundo cartão completo do hotel numa seção de mapas. O índice deve conseguir levar diretamente ao bloco de cada destino.

Cada bloco mostra nome, função, estado de confirmação e ações permitidas. Endereço aparece quando confirmado. Foto e mapa embutido são conteúdo de apoio, depois das ações; podem ficar sob “View map and photo”. O mapa grande deixa de determinar a altura mínima necessária para encontrar um botão. Essa organização deve valer no desktop também.

Hotel mantém Uber porque é o destino autorizado pelo registro. LAPIG apresenta localização de referência e pendência da entrada/endereço; não passa a receber Uber apenas para tornar a interface simétrica. Cidade de Goiás informa transporte organizado e fazendas pendentes, sem sugerir corrida independente. Toda essa distinção deve estar próxima da ação, não apenas na nota final.

URLs precisam funcionar por clique normal, recarga, link copiado e nova aba. Preservar os hashes públicos existentes com compatibilidade onde possível; o antigo #map-panel é genérico e não permite recuperar retrospectivamente um local específico.

## 4. Prioridade alta: agenda com continuidade operacional

**Evidência:** `components/programme.tsx:218` renderiza títulos, horários e apresentadores, mas não os `venueId`, `requirements` e `materials`. O requisito de laptop e conta GEE está em `data/agenda.ts:55`, ausente da interface. Não há links dentro de `.programme` na sessão inspecionada.

**Recomendação:** manter a lista cronológica mobile e a grade proporcional desktop, acrescentando dados que respondem “o que preciso preparar?” e “aonde vou?”. Cada sessão deve mostrar local, ou `Venue pending confirmation`, e acesso ao bloco do local quando houver destino conhecido. Os materiais devem apontar à entrada correspondente de Materials, com seu estado de publicação.

Apresentar o requisito GEE antes do primeiro dia e junto ao curso; preservar os nomes de apresentadores e instituições. Na grade, evitar acrescentar linhas indiscriminadamente a intervalos de 45 minutos: ações compartilhadas por local podem ficar em contexto próximo, e detalhes exigem composição própria. Preservar equivalência informacional da lista acessível. A grade `aria-hidden` não pode receber links focáveis invisíveis à árvore de acessibilidade sem rever sua arquitetura.

Na home, durante o evento, o bloco Now/Next também deve permitir chegar ao local da sessão, quando ele estiver identificado. O relógio continua sendo o oficial de Goiânia e intervalos provisórios não passam a significar sessão em andamento.

## 5. Prioridade média: seleção dos dias e densidade

**Evidência:** abas mobile têm largura mínima de 160 px (`app/globals.css:563`). Só dois dias ficam inteiramente visíveis. #day-5 muda o conteúdo sem trazer sua aba à área visível. O resumo repete data, dia e tema num bloco alto, antes de apresentar a primeira sessão.

**Recomendação:** cinco escolhas compactas visíveis, por exemplo `Mon 14`, `Tue 15`, `Wed 16`, `Thu 17`, `Fri 18`, com rótulos acessíveis completos. Tema e data completa ficam uma vez no título do painel. Se em zoom elevado a rolagem for necessária, trazer a aba ativa à área visível sempre. Manter foco por teclado e links copiáveis.

Reduzir o resumo a uma linha ou pequeno cabeçalho; aproximar a primeira sessão. Testar a necessidade de uma barra de dias aderente sob o cabeçalho durante a leitura de dias longos, contabilizando o espaço total ocupado. Não adicionar simultaneamente navegação superior, inferior e outra barra fixa.

A interface também não expõe ação de impressão, embora exista `ProgrammeForPrint`. Colocar `Print programme` perto das ações da agenda e manter todos os cinco dias no resultado. Verificar paginação separadamente antes da implementação ser considerada concluída.

## 6. Prioridade média: Materials

**Evidência:** 21 itens esperados, nenhum download disponível na versão observada, página de quase seis viewports. O nome em destaque é um link para Programme (`app/materials/page.tsx:63`); ele pode ser interpretado como o arquivo esperado.

**Recomendação:** índice por dia no topo, estado agregado claro (`0 of 21 files published`, calculado), e distinção entre nome do material, `View session` e `Download` quando existir. Oferecer âncoras estáveis para que Programme leve ao material exato. Não criar botões de download sem arquivo.

Conservar os itens pendentes, mas reduzir a repetição de grandes etiquetas e espaçamentos. Quando houver arquivos, mostrar disponível/esperado por dia ajuda a decidir se vale entrar. Com 21 itens, busca e filtros sofisticados ainda não são necessários. A página pode continuar server component, com âncoras HTML e sem estado cliente próprio.

## 7. Prioridade média: pendências e ajuda

**Evidência:** a página atual não tem seções próprias de refeições, necessidades alimentares ou acessibilidade. Emergência aparece apenas no aviso final junto com clima e checklist. Alguns desses assuntos existem no briefing e na lista de pendências, mas isso não os torna encontráveis na interface.

**Recomendação:** criar blocos concisos `Meals` e `Help & accessibility` na página operacional, mantendo `Pending confirmation` onde necessário. Incorporar refeições a partir da agenda e fornecer canal somente quando houver informação aprovada. Um participante precisa distinguir “não foi publicado” de “não existe suporte”.

Trocar avisos gerais repetidos por estados próximos do campo a que se referem. O nome de um hotel pode estar confirmado enquanto pagamento, datas ou check-in continuam pendentes. Uma etiqueta verde geral não comunica essa diferença. A interface não resolve a ausência de um contato de emergência: obter esse contato continua sendo trabalho de conteúdo prioritário.

## 8. Refino visual e acessibilidade

- Preservar paleta, tipografia e fotografias reais. Aumentar a densidade útil em páginas operacionais sem tirar espaço de leitura.
- Botões de transporte hoje usam 12 px, caixa alta e textos longos (`app/globals.css:480`). No hotel a 375 px, o texto se divide em três linhas. Usar rótulos curtos, caixa normal e 14–16 px; uma ação principal em largura confortável, secundárias com menor ênfase.
- Os botões mobile já têm mínimo de 48 px de altura. O problema constatado não é altura insuficiente: é leitura, localização e prioridade. A meta de 44–48 px é conforto de projeto; WCAG 2.2 AA estabelece 24 × 24 CSS px com exceções de espaçamento, não 44 px obrigatório.
- O CSS mobile já move ações antes da mídia. Porém a ordem do DOM ainda coloca foto/mapa antes dos detalhes. Revisar a sequência de foco para que navegar por teclado não leve primeiro aos controles do iframe fora da tela. Isso é um risco identificado na estrutura, ainda não um teste completo com tecnologia assistiva.
- O painel mobile é `tabpanel` nomeado por uma aba escondida; eliminando o seletor, usar seções e títulos simples. Evitar transportar semântica de abas para uma lista de locais.
- Cópia de endereço deve indicar também falha. Hoje a exceção é silenciosa; sucesso temporário é mostrado, mas não há retorno quando o navegador recusa acesso à área de transferência.
- O mapa externo foi observado com controles em português no navegador configurado em português. Auditar esse limite da superfície externa para participantes internacionais, sem atribuí-lo automaticamente ao conteúdo inglês do site.
- Carregar mapa ao expandir reduz custo inicial potencial; medir rede antes de afirmar ganho de desempenho. Informações essenciais não devem depender de o iframe terminar de carregar.

## Especificação de percurso proposto

| Intenção | Caminho recomendado | Informação exposta antes de agir |
| --- | --- | --- |
| Cheguei ao aeroporto | Travel → Open Uber to hotel | Golden Lis e finalidade de hospedagem |
| Vou voltar ao hotel | Travel → Open Uber to hotel | Mesmo destino explícito; sem procurar seletor |
| Que horas sai o ônibus? | Travel → Shuttle | Mon–Thu 08:00 com pendência, sexta 06:30; ponto exato pendente |
| Onde acontece esta sessão? | Programme → local da sessão | Local conhecido ou pendência explícita |
| Quero encaminhar o hotel | Copiar URL com #hotel | Nome e ações preservados após recarga |
| Preciso do material da sessão | Programme → entrada em Materials | Disponibilidade real do arquivo |
| Preciso de apoio | Travel → Help & accessibility | Canal aprovado ou ausência declarada |

## Ordem de execução

1. Restaurar na agenda requisito GEE, locais e pendências; corrigir links de local e visibilidade da aba ativa. São problemas de informação e orientação já reproduzidos.
2. Reorganizar menu e página operacional numa entrega coesa: hotel com ações, transporte, blocos diretos de locais, refeições e ajuda. Consolidar dados existentes, preservando pendências e compatibilidade de links.
3. Encurtar cabeçalhos/resumos mobile e melhorar rótulos de botões. Aplicar a hierarquia de ações antes da mídia também a desktop e tablet.
4. Ligar Programme e Materials nos dois sentidos e acrescentar índice por dia. Expor impressão sem alterar a política do calendário beta nesta intervenção de UX.
5. Validar em dispositivos reais e com participantes; somente então decidir sobre quinta rota, barra inferior ou busca.

## Critérios de aceitação

- Quatro destinos completos no menu a 320, 375, 390 e 430 px, sem fonte funcional reduzida; estado ativo visível.
- Hotel e Uber presentes na primeira tela de Travel a 375 × 812; dados completos continuam acessíveis.
- Escolher outro local não é pré-requisito para encontrar Uber do hotel.
- Recarga, voltar/avançar, link externo e nova aba preservam o local solicitado.
- #day-5 mostra o quinto dia e sua seleção; uma sessão compartilhada fica visível abaixo do cabeçalho.
- Requisito GEE e local/pendência disponíveis na agenda visual e acessível; nomes preservados.
- Material sem arquivo não recebe URL de download; material publicado é alcançável a partir de sua sessão.
- Uber continua restrito a destinos confirmados e permitidos; saídas organizadas não induzem deslocamento independente.
- Nenhuma informação inventada para preencher hotel, refeições, fazendas, acessibilidade ou emergência.
- Testes a 200% de texto, teclado, foco, movimento reduzido e leitor de tela; ausência de overflow horizontal da página.
- Verificação em 768, 1024 e 1440 px para evitar regressão no intervalo entre celular e desktop.
- Impressão inclui cinco dias, informações essenciais e nenhum corte de sessão. Comportamento offline permanece explícito, sem presumir que exportação estática resolve conectividade.

Para uma rodada qualitativa, usar 3–5 pessoas com pouca familiaridade com o site, preferencialmente em inglês e em seus próprios celulares. Pedir para chegar ao hotel, descobrir a saída de sexta, localizar uma sessão, encontrar seu material e buscar apoio. Observar primeiro clique, desvios, necessidade de ajuda e tempo até encontrar a ação correta. Repetir na versão reformulada; não atribuir percentuais de melhoria sem essa comparação. Abrir a tela do Uber basta para o teste: não solicitar uma corrida.

## Referências

- [NN/g — Beyond the Hamburger: What Makes Navigation Discoverable on Mobile](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/): visibilidade e pistas de navegação sustentam a recomendação de destinos expostos. Não fornece uma previsão quantitativa para este site.
- [W3C — Understanding SC 2.5.8, Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): dimensão mínima e exceções; conforto de toque de 44–48 px é uma meta adicional do projeto.
- [Google — Maps URLs](https://developers.google.com/maps/documentation/urls/get-started): distingue abrir busca/local de abrir direções. A função atual usa `/maps/search/`; uma ação chamada `Directions` deve usar o modo de direções com destino confirmado. Para pins apenas referenciais, manter rótulo compatível com sua incerteza.

## Implementation follow-up — 5 September 2026

The organiser approved the changes with three exceptions: no venue fields in
Programme or ICS, remove hotel check-in confirmation, and enable LAPIG Uber.
The implementation follows those corrections; earlier recommendations in this
audit are a record of the analysis, not instructions to restore venue fields.

Verified locally: four fully visible navigation links at 320 and 375 px; hotel
Uber in the initial 375 px viewport (approximately y=470 px); anchored LAPIG
survives reload; maps load only when expanded; address copy reports success;
Day 5 selection remains visible; arrow keys move focus and selection together;
material links reach their specific entry and have explicit session links.
Travel was also reviewed at 768 and 1440 px without horizontal page overflow.
The print DOM contains all five days and 44 items. Physical print pagination,
200% text enlargement, and native Uber app handoff were not tested here.
Three calendar regression tests cover stable event coverage, omission of venue
fields, provisional ends, and clearing old locations in the sync parser.
The sync source change is local; this task does not deploy Apps Script or send
calendar invitations.
