export type Institution = {
  name: string;
  href: string;
  logo: string;
  /**
   * The mark's own dimensions, in its own file. Every asset is cropped to its
   * artwork, so these are ink and not canvas: they are what the home page
   * scales the marks by.
   */
  width: number;
  height: number;
};

export type InstitutionGroup = {
  label: string;
  institutions: Institution[];
};

/**
 * Public roles follow the Global Methane Hub's Time2Graze announcement.
 * Workshop-host roles come from the event brief. Keeping the groups explicit
 * avoids implying that every organisation has the same role.
 */
export const INSTITUTION_GROUPS: InstitutionGroup[] = [
  {
    label: 'Funder',
    institutions: [
      {
        name: 'Global Methane Hub',
        href: 'https://www.globalmethanehub.org/',
        logo: '/logos/institutions/global-methane-hub.png',
        width: 879,
        height: 452,
      },
    ],
  },
  {
    label: 'Data and decision-support leads',
    institutions: [
      {
        name: 'World Resources Institute',
        href: 'https://www.wri.org/',
        logo: '/logos/institutions/world-resources-institute.svg',
        width: 400,
        height: 129,
      },
      {
        name: 'Land & Carbon Lab',
        href: 'https://landcarbonlab.org/',
        logo: '/logos/institutions/land-carbon-lab.svg',
        width: 400,
        height: 176,
      },
      {
        name: 'Alliance of Bioversity International and CIAT',
        href: 'https://alliancebioversityciat.org/',
        logo: '/logos/institutions/alliance-bioversity-ciat.svg',
        width: 251,
        height: 128,
      },
      {
        name: 'INIA Uruguay',
        href: 'https://www.inia.uy/',
        logo: '/logos/institutions/inia-uruguay.png',
        width: 1636,
        height: 812,
      },
      {
        name: 'World Wide Fund for Nature',
        href: 'https://wwf.panda.org/',
        logo: '/logos/institutions/wwf.png',
        width: 109,
        height: 163,
      },
    ],
  },
  {
    label: 'Workshop host',
    institutions: [
      {
        name: 'LAPIG',
        href: 'https://lapig.iesa.ufg.br/',
        logo: '/logos/institutions/lapig-en-color.png',
        width: 958,
        height: 407,
      },
      {
        name: 'Federal University of Goiás',
        href: 'https://ufg.br/',
        logo: '/logos/institutions/ufg-color-horizontal.png',
        width: 652,
        height: 335,
      },
    ],
  },
];

export const INSTITUTION_ROLE_SOURCE =
  'https://www.globalmethanehub.org/2025/09/10/the-global-methane-hub-launches-international-project-to-develop-satellite-guided-grazing-to-cut-livestock-emissions/';
