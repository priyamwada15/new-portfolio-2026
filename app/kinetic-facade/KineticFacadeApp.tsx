"use client";

import { useState } from "react";
import Link from "next/link";
import { KineticFacadeScene } from "./KineticFacadeScene";
import {
  DEFAULT_MATERIAL_VARIANT_ID,
  MATERIAL_VARIANTS,
} from "./materialVariants";

export function KineticFacadeApp() {
  const [variantId, setVariantId] = useState(DEFAULT_MATERIAL_VARIANT_ID);
  const reducedMotion = false;
  const variant = MATERIAL_VARIANTS[variantId];

  return (
    <div className="relative h-screen w-screen bg-[#0a0a0a]">
      <KineticFacadeScene variant={variant} reducedMotion={reducedMotion} />
      <Link
        href="/"
        className="absolute bottom-6 left-6 z-10 text-sm text-white/70 hover:text-white"
      >
        Back Home
      </Link>
    </div>
  );
}
