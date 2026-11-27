import { LockSimple } from "@phosphor-icons/react/dist/ssr";
import { CardTags } from "./CardTags";

/** Status of a case study under NDA, on its homepage card. */
export function CaseStudyStatusPills() {
  return (
    <CardTags
      tags={[
        "In progress",
        <>
          <LockSimple size={12} weight="bold" aria-hidden="true" />
          Limited preview
        </>,
      ]}
    />
  );
}
