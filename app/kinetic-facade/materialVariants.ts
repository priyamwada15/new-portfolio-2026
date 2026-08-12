export type MaterialVariantId = "steel" | "copper" | "copperDissolve";

export type MaterialVariant = {
  id: MaterialVariantId;
  label: string;
  color: string;
  metalness: number;
  roughness: number;
  environmentPreset: "studio" | "sunset";
  interactionMode: "lift" | "dissolve";
};

export const MATERIAL_VARIANTS: Record<MaterialVariantId, MaterialVariant> = {
  steel: {
    id: "steel",
    label: "Steel",
    color: "#c7cdd4",
    metalness: 0.9,
    roughness: 0.25,
    environmentPreset: "studio",
    interactionMode: "lift",
  },
  copper: {
    id: "copper",
    label: "Copper",
    color: "#b5652d",
    metalness: 0.85,
    roughness: 0.35,
    environmentPreset: "sunset",
    interactionMode: "lift",
  },
  copperDissolve: {
    id: "copperDissolve",
    label: "Dissolve",
    color: "#b5652d",
    metalness: 0.85,
    roughness: 0.35,
    environmentPreset: "sunset",
    interactionMode: "dissolve",
  },
};

export const DEFAULT_MATERIAL_VARIANT_ID: MaterialVariantId = "steel";
