"use client";

import { useState } from "react";
import Link from "next/link";
import { KineticFacadeScene } from "./KineticFacadeScene";
import {
  DEFAULT_MATERIAL_VARIANT_ID,
  MATERIAL_VARIANTS,
  type MaterialVariantId,
} from "./materialVariants";

export function KineticFacadeApp() {
  const [variantId, setVariantId] = useState<MaterialVariantId>(
    DEFAULT_MATERIAL_VARIANT_ID,
  );
  const reducedMotion = false;
  const variant = MATERIAL_VARIANTS[variantId];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a]">
      <KineticFacadeScene variant={variant} reducedMotion={reducedMotion} />
      <div className="absolute left-6 top-6 z-10 flex gap-2">
        {Object.values(MATERIAL_VARIANTS).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setVariantId(option.id)}
            className={
              option.id === variantId
                ? "rounded-full bg-white px-4 py-2 text-sm text-black"
                : "rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <Link
        href="/"
        className="absolute bottom-6 left-6 z-10 text-sm text-white/70 hover:text-white"
      >
        Back Home
      </Link>
    </div>
  );
}
