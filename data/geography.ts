/**
 * Orientation for Travel & stay: the city the workshop sits in, and the town
 * it spends Friday in. Most participants arrive from another country and have
 * never been to central Brazil; this is the reference that tells them where
 * they are.
 *
 * The two modules are a pair on purpose. Goiânia was drawn on paper in 1933
 * and built; Cidade de Goiás grew along a river from a gold camp of 1727 and
 * was the capital Goiânia was built to replace. Each one's chronology carries
 * the 1937 transfer from its own side, and that is the point of showing them
 * together rather than a city and a state.
 *
 * It is reference material, not instruction. It says where places are and how
 * far away they are; it does not tell anyone to go to one on their own.
 * Written guidance on moving around Goiânia independently is still owed by
 * LAPIG — see `research/pending-information.md` — and until it arrives the
 * site stays silent on that question rather than reassuring or warning.
 *
 * Every figure carries its source on the fact itself, and
 * `research/geography.md` records where each one came from. The drawn geometry
 * at the foot of this file is generated from official boundary and street data
 * by `research/build-maps.py`; it is never traced or adjusted by hand, and
 * re-running that script must reproduce it exactly.
 */

export type Fact = {
  label: string;
  value: string;
  /** Where the figure comes from, or what qualifies it. Rendered. */
  note?: string;
};

export type Milestone = { year: string; event: string };

/**
 * One numbered marker, drawn on the map and listed in the legend beside it.
 * The marker and its legend entry come from the same record so a map can never
 * carry a pin the list does not explain.
 *
 * `x`/`y` are in the basemap image's own pixel space, so the overlay and
 * the photograph under it share one coordinate system. The generator
 * prints them; never nudge one by hand to make a pin look better placed.
 */
export type MapPlace = {
  n: number;
  x: number;
  y: number;
  name: string;
  /** One line: what the place is, or why a participant is shown it. */
  detail: string;
  /**
   * Straight-line distance from the map's origin. Absent on the origin, and
   * absent altogether on the town map, where every marker is within a few
   * hundred metres of the next and a column of distances would say nothing.
   */
  distance?: string;
  /** Somewhere the workshop actually takes people. Drawn heavier. */
  workshop?: boolean;
};

/* ------------------------------------------------------------------ city */

export const GOIANIA_INTRO =
  'Goiânia is a planned city. It was laid out on the Cerrado plateau from 1933 to take the seat of state government from the colonial town the workshop visits on Friday, and its centre was drawn as a radial plan around one civic square.';

export const GOIANIA_HISTORY: Milestone[] = [
  {
    year: '1933',
    event:
      'Foundation stone laid on 24 October, under the state interventor Pedro Ludovico Teixeira.',
  },
  {
    year: '1935',
    event:
      'Attílio Corrêa Lima’s plan is approved: a radial-concentric centre, with avenues running out from one civic square.',
  },
  {
    year: '1937',
    event: 'The seat of state government is transferred from the town of Goiás.',
  },
  {
    year: '1942',
    event:
      'The city is formally inaugurated, in the ceremony known as the Batismo Cultural.',
  },
  {
    year: '2003',
    event:
      'IPHAN lists the Art Deco ensemble: 22 buildings and monuments, most of them publicly owned.',
  },
];

export const GOIANIA_FACTS: Fact[] = [
  { label: 'Elevation', value: '749 m', note: 'Central Plateau' },
  { label: 'Residents', value: '1,437,366', note: 'IBGE, 2022 Census' },
  { label: 'Municipal area', value: '729.3 km²', note: 'IBGE, 2022' },
  { label: 'River', value: 'Meia Ponte', note: 'The one river crossing the city' },
  { label: 'Local time', value: 'UTC−3', note: 'No daylight saving' },
  {
    label: 'Mid-September',
    value: 'End of the dry season',
    note: 'The rains return in October',
  },
];

/** Numbered on the city map. Distances are straight-line, from the hotel. */
export const GOIANIA_PLACES: MapPlace[] = [
  {
    n: 1,
    x: 582,
    y: 575,
    name: 'Golden Lis Hotel Boutique',
    detail: 'Accommodation, and where the workshop shuttle leaves from.',
    workshop: true,
  },
  {
    n: 2,
    x: 300,
    y: 114,
    name: 'LAPIG · UFG',
    detail: 'Campus Samambaia. Welcome and the technical sessions.',
    distance: '5.1 km',
    workshop: true,
  },
  {
    n: 3,
    x: 860,
    y: 493,
    name: 'Santa Genoveva Airport',
    detail: 'Goiânia’s airport (GYN), and the arrival point for most participants.',
    distance: '2.7 km',
  },
  {
    n: 4,
    x: 386,
    y: 1047,
    name: 'Praça Cívica',
    detail: 'The square the 1933 plan was drawn around, at the centre of the Art Deco ensemble.',
    distance: '4.8 km',
  },
];

/* ------------------------------------------------------------------ town */

export const TOWN_INTRO =
  'Cidade de Goiás began as a gold camp on the Rio Vermelho in 1727 and was the seat of the state until Goiânia replaced it in 1937. UNESCO inscribed the historic centre in 2001 for a plan shaped by the river and the hills rather than drawn on paper — the inverse of the capital that succeeded it. The workshop spends Friday here.';

export const TOWN_HISTORY: Milestone[] = [
  {
    year: '1727',
    event:
      'Bartolomeu Bueno da Silva finds gold on the Rio Vermelho, and the camp of Sant’Ana is founded on its banks.',
  },
  {
    year: '1739',
    event: 'The camp becomes Vila Boa de Goiás, the seat of the captaincy.',
  },
  {
    year: '1889',
    event:
      'Ana Lins dos Guimarães Peixoto, who wrote as Cora Coralina, is born in the house by the bridge.',
  },
  {
    year: '1937',
    event:
      'Government moves to the new Goiânia. The town keeps the name Goiás and loses the capital.',
  },
  {
    year: '2001',
    event:
      'UNESCO inscribes the historic centre, on criteria (ii) and (iv), for its adaptation to the river and the terrain.',
  },
];

export const TOWN_FACTS: Fact[] = [
  { label: 'Residents', value: '24,071', note: 'IBGE, 2022 Census' },
  { label: 'Municipal area', value: '3,108.4 km²', note: 'IBGE, 2022' },
  {
    label: 'Cattle',
    value: '335,983',
    note: 'About 14 head per resident · IBGE, 2023',
  },
  {
    label: 'World Heritage',
    value: 'Since 2001',
    note: 'Historic centre · criteria (ii) and (iv)',
  },
  { label: 'State capital', value: '1739–1937', note: 'Succeeded by Goiânia' },
  {
    label: 'From Goiânia',
    value: '126 km',
    note: 'Friday departure 06:30, by workshop bus',
  },
];

/**
 * Numbered on the town map, north to south, because the town is a line along
 * the river and that is the order a reader traces down the drawing. No
 * distances: the four are within 750 m of one another, and a column of
 * walking-scale figures would only crowd the list.
 */
export const TOWN_PLACES: MapPlace[] = [
  {
    n: 1,
    x: 616,
    y: 346,
    name: 'Igreja do Rosário',
    detail:
      'The right-bank church, recorded in the UNESCO citation as the one reserved for the town’s enslaved population.',
  },
  {
    n: 2,
    x: 603,
    y: 419,
    name: 'Casa de Cora Coralina',
    detail:
      'The poet’s house beside the bridge over the Rio Vermelho, now a museum.',
  },
  {
    n: 3,
    x: 614,
    y: 578,
    name: 'Palácio Conde dos Arcos',
    detail: 'The governor’s palace, and the seat of the state until 1937.',
  },
  {
    n: 4,
    x: 597,
    y: 820,
    name: 'Museu das Bandeiras',
    detail: 'The colonial town hall and jail, on the main square.',
  },
];

/**
 * The two towns in the locator inset drawn in the corner of the town map,
 * in `LOCATOR_MAP`'s own units. `research/build-maps.py` prints them.
 */
export const LOCATOR_PLACES = {
  goiania: { x: 347, y: 386 },
  cidade: { x: 272, y: 321 },
} as const;

/* --------------------------------------------------------------- drawn geometry
 * Generated, not written. Boundaries come from IBGE's territorial mesh service
 * and the streets and rivers from OpenStreetMap; each map is projected
 * equirectangularly on its own centre latitude, so `kmPerUnit` is exact along
 * that parallel and the scale bar can be drawn from it. `research/geography.md`
 * holds the requests, the licences and the projection.
 */

export const GOIANIA_MAP = {
  src: '/images/maps/goiania.webp',
  width: 1160,
  height: 1161,
  /** Kilometres per image pixel, across the frame's centre latitude. */
  kmPerUnit: 0.009396,
  river: 'M95 207L98 208L101 212L101 218L99 223L102 232L101 237L103 242L108 245L129 246L142 248L154 246L161 247L162 251L161 255L156 257L152 271L152 278L155 282L166 285L168 288L165 298L163 299L156 295L151 295L140 299L130 308L130 311L133 316M472 660L476 666L477 672L479 675L481 676L484 676L492 671L495 664M133 316L141 327L146 340L154 330L165 322L173 320L185 322L189 328L187 339M83 197L85 201L90 205L95 207M72 192L79 194L83 197M6 154L12 157L15 157L19 154L21 150L20 148L18 146L13 145L9 141L11 139L18 138L35 143L43 147L51 149L56 153L55 160L60 169L62 176L61 187L63 190L72 192M209 358L218 355L235 361L245 363L252 369L255 378L256 386L254 392L238 404L237 410L238 419M187 339L194 347L203 355L209 358M270 467L275 478L277 489L281 500L291 508L295 515L302 522M890 763L898 761M865 748L873 750L885 762L890 763M827 709L844 712L852 717L855 729L865 748M586 677L600 690L613 706L621 713L626 720L632 731L646 732L655 739L661 758L657 768L677 779L696 766L708 762L723 759L745 742L754 742L766 744L790 746L796 740L800 729L806 717L816 711L827 709M312 555L326 553L335 548L340 542L351 541L363 538L371 534L382 533L394 541L397 544L400 552L399 555L397 557L395 557L393 555L388 554L375 557L370 555L363 556L362 567L367 572L374 570L377 564L385 566L391 575L393 585L401 601L397 620L397 626L401 634L406 638L413 641L427 642L441 647L452 647L454 644L454 637L450 616L451 612M302 522L309 545L309 552L312 555M898 761L905 761L910 764L918 764L924 761L942 759L948 761L962 776L987 780L998 787L1002 797L1004 809L999 818L992 820L991 826L995 828L1002 824L1022 826L1028 825L1033 826L1038 832L1028 853L1031 860L1030 870L1031 873L1038 881L1041 889L1040 896L1037 904L1039 913L1060 923L1064 926L1071 943L1068 949L1064 954L1065 959L1072 971L1073 978L1071 987L1058 996L1052 1003L1049 1011L1037 1019L1037 1026L1038 1029L1040 1030L1050 1028L1064 1035L1071 1037L1074 1042L1074 1048L1059 1064L1058 1071L1074 1079L1090 1098L1093 1108L1087 1122L1087 1131L1080 1135L1075 1145L1075 1154L1069 1165M451 612L457 615L462 625L461 643L462 647L472 660L476 661L480 659L495 664L501 656L510 655L535 647L540 647L547 655L577 671L586 677M-2 149L6 154M239 424L240 445L241 448L254 457L263 460L270 467M238 419L239 424',
} as const;

export const TOWN_MAP = {
  src: '/images/maps/cidade-de-goias.webp',
  width: 1160,
  height: 1160,
  /** Kilometres per image pixel, across the frame's centre latitude. */
  kmPerUnit: 0.001553,
  water: 'M671 -10L653 39L661 54L663 71L672 86L665 123L659 146L659 179L661 197L681 202L714 219L722 225L730 256L742 279L751 300L750 320L743 327L728 331L715 332L700 340L681 360L664 397L629 424L606 429L568 442L557 451L543 466L528 477L501 493L492 497L474 492L460 491L447 493L410 496L389 499L372 513L368 530L360 548L347 559L326 569L282 597L258 604L233 607L214 607L192 609L159 603L147 603L137 617L122 632L120 646L125 669L123 679L129 701L131 722L137 751L137 771L127 778L112 774L95 785L94 795L84 802L69 808L53 817L42 835L44 853L58 856L66 860L73 869L59 892L43 904L32 908L14 896L-2 887M-30 776L4 753L20 740L29 727L18 701L-2 698',
} as const;

/** Drawn small, inside the town map, to place the town within the state. */
export const LOCATOR_MAP = {
  width: 640,
  height: 644,
  state: 'M433 297L436 294L436 283L501 283L501 287L505 290L509 292L508 294L508 299L510 300L510 304L506 312L505 317L506 320L505 323L505 327L510 330L512 327L517 328L519 326L525 320L527 323L532 321L551 317L553 315L551 311L552 308L551 303L548 299L548 293L546 293L541 288L542 278L544 275L549 272L550 268L547 264L545 260L542 262L542 257L546 249L543 246L543 244L548 240L554 241L568 247L572 247L578 244L576 240L577 237L575 235L575 230L576 226L573 223L573 220L575 218L577 216L578 213L580 214L585 218L593 223L593 226L595 227L593 231L596 233L601 233L606 235L610 232L613 234L618 227L617 224L620 221L620 217L620 212L618 211L621 210L621 206L620 205L622 198L620 197L621 195L619 193L620 191L626 188L628 183L625 182L623 177L621 174L618 175L615 172L615 169L612 169L610 166L605 165L602 161L601 156L602 153L602 150L598 147L599 142L601 139L597 134L602 132L599 129L600 127L599 124L602 120L607 117L603 115L601 116L599 110L601 107L603 105L601 101L604 101L609 98L614 92L614 91L612 87L596 92L595 87L595 76L593 73L597 67L604 64L610 61L611 58L604 61L589 64L590 53L587 52L585 49L584 59L583 59L582 62L557 62L551 65L548 71L545 69L535 77L529 80L525 80L523 83L517 82L515 83L513 88L504 85L503 88L501 88L498 87L495 83L496 81L491 81L489 80L489 75L485 74L482 75L482 78L480 83L483 88L481 91L482 95L484 98L479 106L469 93L467 92L462 93L458 90L455 92L454 90L450 89L447 85L446 90L439 92L438 91L440 89L438 85L438 81L440 78L437 78L433 80L428 84L424 85L420 88L414 89L412 80L413 79L409 77L408 82L406 83L406 91L404 92L402 90L403 87L404 76L402 70L400 69L399 66L396 64L392 65L391 63L391 58L382 51L381 48L379 48L371 61L366 56L361 55L362 52L360 50L359 46L351 54L349 55L347 59L345 62L343 67L340 70L339 74L340 76L339 84L340 87L338 89L286 60L277 57L269 55L266 53L261 51L258 47L260 40L262 34L265 32L264 30L268 27L265 24L267 20L273 12L267 16L259 20L257 24L254 26L250 32L248 35L248 38L244 40L244 42L245 45L242 53L241 62L239 64L235 65L237 68L233 70L235 73L234 81L235 84L233 93L228 99L229 103L227 104L225 108L221 110L220 118L217 126L211 129L213 131L212 137L214 140L214 145L212 149L213 154L215 159L213 162L209 162L203 178L203 181L202 183L201 188L202 192L203 194L204 198L201 202L201 205L198 210L198 214L196 217L197 221L193 225L193 232L189 234L187 238L183 241L178 243L176 242L175 238L172 237L170 240L165 240L162 243L156 245L150 253L146 254L145 260L146 263L144 264L143 268L144 272L142 275L141 280L142 282L139 283L140 287L137 288L137 293L136 296L127 311L121 310L116 317L107 316L106 317L100 316L95 317L95 321L92 323L89 333L71 341L71 349L61 351L60 353L59 359L60 363L63 363L66 369L64 372L64 373L60 378L58 379L55 378L56 380L53 385L53 388L51 389L47 394L42 394L39 400L35 402L32 402L30 409L28 411L27 415L28 419L24 423L22 427L20 430L15 441L16 447L13 452L14 454L13 458L13 466L12 469L13 476L16 477L19 481L22 487L22 494L27 498L26 506L22 506L21 508L24 520L24 528L27 531L31 532L32 530L36 527L38 527L43 529L48 528L52 530L53 533L50 537L43 539L43 542L40 546L36 548L37 551L39 555L40 557L43 557L46 559L49 559L54 561L59 560L64 561L67 561L69 559L72 558L79 561L82 566L87 571L88 573L91 574L101 575L104 579L107 580L108 582L110 584L113 584L116 586L125 588L129 593L132 593L140 598L145 600L150 601L151 599L159 602L165 603L170 608L175 607L177 611L182 611L186 613L193 615L197 618L199 622L202 624L206 629L213 632L215 630L211 625L216 614L222 609L223 605L227 604L228 600L235 601L240 597L242 592L243 589L242 584L247 579L249 574L254 571L258 562L262 561L268 560L271 559L278 560L280 557L282 554L286 554L290 556L294 554L302 557L305 554L308 554L314 551L315 550L323 548L323 545L327 544L328 548L334 557L337 556L341 550L344 550L345 548L348 547L349 543L352 541L351 538L355 537L358 535L362 537L364 536L366 533L368 534L372 529L375 528L383 531L383 534L389 531L390 532L405 529L406 531L409 533L413 533L415 532L419 534L424 533L426 533L430 530L433 531L434 533L439 534L440 537L444 539L448 538L453 541L456 545L460 542L462 543L467 537L472 538L474 533L478 534L479 532L485 529L483 527L485 523L489 520L491 520L495 518L498 515L500 516L513 505L509 500L508 492L506 492L507 485L510 475L513 473L513 470L514 467L509 460L505 460L503 458L497 460L494 458L493 454L491 454L493 442L495 444L500 442L502 436L504 435L507 429L512 426L513 424L517 421L520 420L521 417L524 417L525 412L523 410L521 405L519 403L519 400L518 394L516 392L517 389L516 388L515 385L507 378L505 378L500 374L498 371L498 367L500 365L500 361L506 355L507 351L509 347L509 345L507 338L510 334L510 331L429 331L431 323L429 319L429 312L432 309L435 305L435 302L432 301L433 297Z',
  df: 'M451 331L510 331L510 330L505 327L505 323L506 320L505 317L506 312L510 304L510 300L508 299L508 294L509 292L505 290L501 287L501 283L436 283L436 294L433 297L432 301L435 302L435 305L432 309L429 312L429 319L431 323L429 331L451 331Z',
} as const;
