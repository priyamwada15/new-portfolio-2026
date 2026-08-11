export type MaterialVariantId = "steel" | "copper";

export type MaterialVariant = {
  id: MaterialVariantId;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
  environmentPreset: "studio" | "sunset";
};

export const MATERIAL_VARIANTS: Record<MaterialVariantId, MaterialVariant> = {
  steel: {
    id: "steel",
    label: "Steel",
    color: "#c7cdd4",
    metalness: 0.9,
    roughness: 0.25,
    environmentPreset: "studio",
  },
  copper: {
    id: "copper",
    label: "Copper",
    color: "#b5652d",
    metalness: 0.85,
    roughness: 0.35,
    environmentPreset: "sunset",
  },
};

export const DEFAULT_MATERIAL_VARIANT_ID: MaterialVariantId = "steel";
