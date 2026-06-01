/** Brand accent colors for case studies and homepage cards. */

export const brands = {
  rocket: {
    primary: "var(--ds-color-brand-rocket)",
    light: "var(--ds-color-brand-rocket-light)",
    dark: "var(--ds-color-brand-rocket-dark)",
    accentDark: "var(--ds-color-primary)",
    accentLight: "var(--ds-color-gray-subtle)",
  },
  tars: {
    primary: "var(--ds-color-brand-tars)",
    light: "var(--ds-color-brand-tars-light)",
    accentDark: "var(--ds-color-brand-tars)",
    accentLight: "var(--ds-color-brand-tars-light)",
  },
  salesforce: {
    primary: "var(--ds-color-brand-salesforce)",
    light: "var(--ds-color-brand-salesforce-light)",
    accentDark: "var(--ds-color-brand-salesforce)",
    accentLight: "var(--ds-color-brand-salesforce-light)",
  },
  default: {
    accentDark: "var(--ds-accent-default)",
    accentLight: "var(--ds-accent-subtle)",
  },
} as const;

export type BrandKey = keyof typeof brands;
