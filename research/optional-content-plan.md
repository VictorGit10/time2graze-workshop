# Conteúdos opcionais — plano editorial e de experiência

Preparado em 9 de setembro de 2026; implementação local concluída na mesma data. O plano inicial abaixo permanece como registro da pesquisa.

## Escopo implementado

Revisão editorial adicional: removido o capítulo “A university connection” do
FICA por solicitação do usuário. UFG, Goiânia, Cidade de Goiás e Cerrado usam
seletores fotográficos com miniaturas, mantendo ampliação e créditos. As duas
cidades apresentam as datas em sequência cronológica. O Cerrado alterna entre
locais explicitamente distintos; não utiliza uma sobreposição que sugeriria
comparação temporal ou geográfica do mesmo lugar. Painéis longos têm progresso
de leitura vinculado à rolagem por CSS, somente com suporte do navegador e sem
preferência por movimento reduzido. Nenhuma nova afirmação factual foi adicionada.

Revisão de navegação: as sete entradas agora mostram “Learn more” com seta e abrem painéis modais nativos. No computador o painel é amplo; no celular ocupa a tela. Uma barra fixa oferece “Back to page” e “Copy link”. Escape fecha a camada ativa; os links relacionados na mesma página substituem o conteúdo aberto sem acumular entradas no histórico. Fotografias usam uma segunda camada, com bloqueio de rolagem compartilhado. O botão Voltar do navegador retorna ao ponto de origem. Links recebidos diretamente podem ser fechados sem sair do site. Sem JavaScript, o texto permanece disponível na página. `scripts/story-navigation.test.mjs` cobre o histórico e o bloqueio de rolagem.

Por decisão do usuário, `about-time2graze` e `about-land-carbon-lab` foram excluídos. Foram implementados sete conteúdos: UFG, LAPIG e FUNAPE na Home; Goiânia, Cerrado, Cidade de Goiás e FICA em Practical information. Todos abrem dentro das quatro páginas existentes, por entradas discretas e links contextuais.

Os textos são renderizados no HTML; as galerias carregam apenas quando o conteúdo é aberto. Há ampliação de fotografias, navegação por teclado, links diretos e respeito à preferência por movimento reduzido. Oito novas imagens reais foram incorporadas em WebP com miniaturas, créditos e licenças, além da fotografia existente do LAPIG. A procedência está em `optional-content-image-provenance.json` e os dados em `data/story-images.json`. O FICA utiliza composição tipográfica e links oficiais, sem fotografia cuja autorização esteja pendente. Sua edição de junho não é apresentada como atividade do workshop de setembro.

Os documentos de textos e mídia registram também propostas iniciais que não entraram nesta implementação; os arquivos em `data/optional-content.ts` e `data/optional-media.ts` representam o conteúdo efetivamente utilizado.

Documentos de trabalho:

- [Textos em inglês, fatos e fontes](optional-content-copy.md)
- [Fotografias, vídeos e direitos de uso](optional-content-media.md)

## Direção acordada

O conteúdo essencial permanece imediatamente acessível. Os assuntos adicionais aparecem mediante escolha, em pontos relacionados ao que o participante já está lendo. Depois do clique, podem ocupar bastante espaço e ter fotografias grandes, galerias e animações expressivas. A autorização do usuário em 9 de setembro amplia deliberadamente a liberdade visual dessas áreas; não é necessário restringi-las à sobriedade de uma ficha de transporte.

Continuam válidos: quatro páginas, inglês na interface, fatos documentados, identidade tipográfica e cromática existente, horários legíveis e navegação persistente. A metáfora de buffet é uma orientação editorial interna; não vira nome de seção, ilustração ou sistema de navegação.

## Nove conteúdos, em dois lugares

| ID proposto | Conteúdo | Entrada principal | Entrada contextual adicional | Apresentação depois do clique |
| --- | --- | --- | --- | --- |
| `about-time2graze` | Time2Graze | Home, após o objetivo | Nome do projeto na apresentação institucional | Diagrama animado de dados, observações de campo e decisões; fotografia real |
| `about-ufg` | UFG | Home, identificação do anfitrião | Local LAPIG/UFG na página prática | Fotografia ampla do campus, apresentação e galeria |
| `about-lapig` | LAPIG | Home, junto da UFG | Local LAPIG na página prática | Trabalho do laboratório, imagens de pesquisa quando autorizadas, acesso aos produtos |
| `about-funape` | FUNAPE | Home, área institucional | Nenhuma entrada logística necessária | Apresentação editorial breve, sem depender de marca ou fotografia |
| `about-land-carbon-lab` | Land & Carbon Lab | Home, área institucional | Conteúdo Time2Graze | Diagrama de observação da paisagem e acesso à fonte |
| `about-goiania` | Goiânia | Practical → City & free time | Nenhuma nova entrada na Home | Fotografias, história urbana e sequência cronológica |
| `about-cidade-de-goias` | Cidade de Goiás | Practical → destino da sexta-feira | Ligação ao fim da história de Goiânia | Ensaio fotográfico, patrimônio, Cora Coralina e ligação ao FICA |
| `about-fica` | FICA | Junto de Cidade de Goiás | Dentro do conteúdo UFG, apenas como ligação relacionada | Cinema, ambiente e edição de 2026; fotos de edição identificada se liberadas |
| `about-cerrado` | Cerrado | Practical → City & free time | Conteúdos LAPIG e Cidade de Goiás | Paisagens vistas do chão e por satélite, com localização e data |

FICA tem entrada própria junto de Cidade de Goiás para ficar a um clique, sem obrigar o leitor a abrir história → cultura → festival. Cora Coralina é um capítulo de Cidade de Goiás; não precisa de uma décima entrada.

## O que muda em cada página

### Home

Preservar a abertura, o botão Programme e o diretório. Introduzir `About Time2Graze` depois do objetivo e `About UFG and LAPIG` junto do anfitrião. Este último abre o conteúdo UFG, que contém um acesso claro a LAPIG.

A área institucional passa a oferecer apresentações dos cinco assuntos. Os quatro logos atuais continuam com sua identificação e acesso ao site oficial. O acesso ao conteúdo local deve ser um controle textual separado e previsível. FUNAPE entra como nome e apresentação, conforme pedido do usuário; a inclusão desse texto não exige atribuir-lhe patrocínio, organização ou colocar um novo logo na faixa de marcas.

Evitar cinco cartões altos permanentemente expostos. Antes da abertura, usar nomes e convites compactos; depois, conceder o espaço que cada assunto merece.

### Practical information

Manter hotel, shuttle, entradas e demais ações operacionais na frente. No bloco LAPIG, acrescentar uma ligação para a apresentação institucional canônica na Home.

A história já existente de Cidade de Goiás migra para o conteúdo expandido, sem ser duplicada. Seu painel deve ocupar a largura útil da seção, abaixo das duas colunas atuais. A galeria não deve ficar espremida na coluna estreita de detalhes. Preservar a fotografia já publicada uma única vez na composição normal; sua ampliação pode usar o mesmo arquivo.

Em City & free time, manter a frase de contexto e acesso ao mapa visíveis; mover a história mais extensa de Goiânia para sua abertura opcional. Oferecer `History and photos of Goiânia` e `The Cerrado landscape`. O Google My Maps fornecido permanece como está.

### Programme e Materials

Nenhuma expansão cultural ou institucional necessária. Arquivos de pesquisa externos permanecem nos conteúdos de LAPIG/Time2Graze: não entram na lista de materiais produzidos pelas sessões.

## Como abrir, ler e voltar

Escolha recomendada: painéis editoriais expansíveis dentro da página. Cada assunto tem título, introdução, capítulos curtos, mídias e fontes; seu conteúdo existe no HTML exportado. Uma janela sobreposta é usada apenas para ampliar imagens.

1. O convite tem nome específico, contraste e área de toque confortável. Discreto significa ocupar pouco espaço fechado, não usar texto minúsculo.
2. O painel abre abaixo do bloco relacionado e ocupa o mesmo alinhamento de conteúdo da página. A pessoa vê onde começou a expansão.
3. Textos institucionais usam uma introdução e até três blocos pequenos. Histórias de lugares usam fotos amplas entre capítulos. Não há uma sequência de caixas fechadas dentro de outras caixas.
4. `Close` permanece disponível no início e no fim de conteúdo longo. Ao fechar, o foco retorna ao convite e a posição de leitura é preservada.
5. Cada assunto tem endereço compartilhável na página existente, por exemplo `/practical/#about-fica`. O link abre o painel antes de medir e rolar. Voltar/avançar do navegador restaura um estado coerente; um fragmento inválido não deve lançar erro nem esconder conteúdo essencial.
6. O acesso da página prática a UFG pode apontar para `/#about-ufg`; existe um único texto mantido para essa instituição. Não adicionar uma rota por assunto.
7. Sem JavaScript, a abertura de texto funciona com `details/summary`. A abertura automática por fragmento é uma melhoria do componente cliente. Fotografias ampliáveis têm ligação acessível ao arquivo caso a galeria não esteja disponível.

Os IDs acima são propostas, ainda não links ativos. O resolvedor cultural deve tratar apenas esses IDs. Não reutilizar nem modificar o resolvedor do Programme ou os seus `data-session`.

## Direção visual e movimento

As áreas abertas podem ter uma composição de revista, com fotografias em formatos variados, títulos maiores e sequências visuais. A intensidade varia pelo assunto; não aplicar a mesma galeria e o mesmo efeito a tudo.

| Conteúdo | Recurso expressivo | O que comunica |
| --- | --- | --- |
| UFG | Fotografia larga e duas imagens menores; abertura suave | Campus e contexto universitário |
| LAPIG | Sequência de campo, imagem e produto, quando houver material autorizado | Como o trabalho é realizado |
| Time2Graze | Diagrama que destaca uma etapa por vez ao toque/clique | Relação entre observação, modelo, participação do usuário e decisão |
| FUNAPE | Tipografia bem composta e pequena sequência de funções | O que faz uma fundação de apoio |
| Land & Carbon Lab | Diagrama de paisagens observadas e usos dos dados | Alcance do monitoramento além de florestas |
| Goiânia | Sequência 1933 → 1937 → 2003, alternada com fotos | Fundação, mudança da capital e reconhecimento patrimonial |
| Cidade de Goiás | Ensaio fotográfico com capítulos sobre cidade, rio e literatura | Relação entre paisagem construída e história |
| FICA | Fotografia de sessão identificada, títulos de capítulos e transições de imagens | A cidade também produz cultura contemporânea |
| Cerrado | Alternância manual entre vista do chão e imagem orbital | Duas escalas de observação, com locais explicitamente distintos |

O efeito da abertura usa os tokens de movimento atuais. Transições de galeria podem usar fade e pequeno deslocamento; rolagem revela apenas elementos curtos. Não ocultar um artigo inteiro atrás de uma entrada animada. Diagramas conceituais são identificados como tal, sem simular dados do projeto.

Para imagens de lugares distintos, não usar um comparador antes/depois, uma transição que sugira zoom contínuo, nem um mapa inventado. Serra de Caldas, Serra Dourada e Campus Samambaia têm nomes próprios nas legendas.

Sem reprodução automática de vídeo ou áudio. Galerias avançam por escolha; animações longas têm pausa. Respeitar redução de movimento, navegação por teclado, zoom de texto e foco visível. São condições de leitura, não limites à quantidade de fotografias.

## Conteúdo e arquivos

Na implementação, separar `data/optional-content.ts` de `data/optional-media.ts`, com IDs estáveis e referências por ID. Fontes ficam associadas aos blocos que sustentam, não apenas num rodapé genérico. Datas históricas são diferentes de `checkedAt`, que registra a checagem editorial.

Campos mínimos de um assunto: `id`, `title`, `triggerLabel`, `homeRoute`, `lead`, `sections`, `relatedIds`, `sourceIds`. Um bloco contém texto, mídia ou diagrama conceitual. Não construir um CMS genérico.

Campos mínimos de mídia: `id`, `sourcePage`, `creator`, `license`, `licenseUrl`, `rightsStatus`, `caption`, `alt`, `width`, `height`, `place`, `captureDate` quando disponível, `edits`, `src` apenas depois de existir arquivo local. `rightsStatus` distingue licença documentada, permissão específica e autorização pendente. Os nomes de arquivos sugeridos não entram no site antes de sua produção.

Os textos seguem como conteúdo de servidor; só abertura automática por fragmento, galeria e diagramas interativos precisam de JavaScript. As rotas de Materials e Practical continuam componentes de servidor que compõem essas pequenas áreas interativas.

## Volume e desempenho

Primeira seleção editorial pretendida: cerca de 15–22 imagens distintas, distribuídas conforme qualidade e disponibilidade. Isso é uma meta de composição, não uma obrigação de preencher espaços. A pré-seleção documentada ainda não cobre todas as posições e não substitui revisão visual.

- Metas de produção, ainda não medições: miniaturas de 20–60 KB; imagens normais de 100–250 KB; ampliações de 250–600 KB quando a qualidade permitir.
- Produzir tamanhos responsivos compatíveis com a exportação estática; não depender de um otimizador de imagens em servidor que o deployment não tem.
- Painéis fechados não devem baixar as imagens grandes. `loading="lazy"` isoladamente não garante isso: carregar a mídia opcional ao abrir e confirmar no painel de rede. O HTML de texto permanece presente.
- Fixar proporções para não deslocar texto durante o carregamento. Baixar no máximo a próxima imagem da galeria, não todas as ampliações.
- Vídeos abrem na fonte por padrão; embed somente quando suportado, sob demanda, com idioma e legendas verificados.
- O conteúdo essencial não espera por uma galeria, mapa extra ou animação.

## Sequência de implementação

1. Levar os nove textos e fontes para os módulos de dados, preservando sua revisão editorial.
2. Criar abertura acessível, fechamento e fragmentos; testar inicialmente com UFG e Cidade de Goiás.
3. Produzir a primeira seleção de imagens licenciadas, registrar créditos e revisar visualmente cada uma.
4. Montar Home e Practical, migrando o conteúdo histórico existente sem duplicação.
5. Acrescentar galeria e movimento, começando por Cidade de Goiás e Cerrado; depois os diagramas institucionais.
6. Completar mídias de FICA e pesquisa local quando existirem permissões. Os textos funcionam antes dessas mídias.
7. Verificar telefone, desktop, teclado, redução de movimento, fragmentos e impressão. Publicar apenas numa etapa posterior de implementação.

## Critérios para aceitar a implementação

- Os quatro destinos e a consulta de horários continuam acessíveis com os conteúdos fechados e abertos.
- Com tudo fechado, a página não ganha telas de fotografias; acrescenta apenas convites próximos do contexto.
- Aberturas de UFG, FUNAPE e FICA são encontráveis por nomes compreensíveis e ficam a um clique da sua entrada principal.
- Uma leitura em 375/390 px funciona sem rolagem horizontal e sem ações de transporte escondidas atrás de fotos.
- Fragmentos funcionam após navegação entre páginas, recarga, abertura em nova aba e uso do histórico. `basePath` é aplicado sem escrever o nome do repositório.
- Galeria tem texto alternativo, legenda/crédito, controles rotulados, Escape, foco contido enquanto aberta e retorno ao acionador.
- No modo de movimento reduzido, nenhuma informação fica escondida e nenhum deslocamento contínuo permanece.
- Em impressão, preservar a história de Cidade de Goiás que já imprime; imprimir o texto de assuntos opcionais abertos, ocultar galerias ampliadas/controles e zerar animações. Não alterar as cinco páginas do Programme.
- Uma fonte inacessível não impede ler o resumo local. Toda mídia publicada tem arquivo e direitos documentados.

## Pendências pontuais

| Item | Situação | Impacto |
| --- | --- | --- |
| Papel da FUNAPE neste workshop | Não localizado nas fontes públicas consultadas | Publicar descrição geral; não atribuir organização, financiamento ou gestão específica |
| Forma extensa preferida de LAPIG em inglês | Fontes institucionais usam formas portuguesas diferentes | Usar LAPIG com descrição da atividade, evitando inventar tradução oficial |
| Fotos/cartazes do FICA | Fontes encontradas, permissão de reutilização não estabelecida | Texto e links podem entrar; galeria do festival aguarda mídia autorizada |
| Fotos recentes de pessoas trabalhando no LAPIG e experimentos | Usar o acervo que a equipe puder fornecer com permissão | Não ilustrar uma fazenda genérica como área visitada |
| Galerias completas | Pré-seleção com metadados pronta; inspeção visual e otimização ainda por fazer | Etapa de produção da implementação |
| TV UFG / filmes do FICA em setembro | Encontrada pista em imprensa; fonte primária e disponibilidade não verificadas | Não anunciar sessão, streaming ou legendas como disponíveis |

O pedido atual autoriza a pesquisa e o planejamento. Essas pendências não impedem a estrutura nem os textos gerais. Não foram enviados pedidos de autorização ou mensagens a terceiros.
