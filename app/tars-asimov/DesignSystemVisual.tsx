import { CaretDown, CaretUp, CheckCircle, Hash, Lock, Plus } from "@phosphor-icons/react/dist/ssr";
import { mediaPanel } from "@/design-system";

/**
 * EXAMPLE LAYOUT for the design system visual: foundations → components → a screen
 * built from them. Colours, type and pill states are illustrative stand-ins until
 * they're replaced with Asimov's real tokens and variants.
 */

/** Full class strings so Tailwind can see them. */
const PILL = {
  syncing: "bg-tag-purple-bg text-tag-purple-fg",
  synced: "bg-tag-green-bg text-tag-green-fg",
  failed: "bg-tag-red-bg text-tag-red-fg",
  paused: "bg-tag-gray-bg text-tag-gray-fg",
} as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-label text-[12px] font-semibold uppercase leading-[21px] tracking-[0.08em] text-[var(--accent-dark)]">
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-label text-[12px] leading-[18px] text-tertiary">{children}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-surface-case-study p-4 ${className}`}>{children}</div>
  );
}

function StatusPill({ state }: { state: keyof typeof PILL }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[2px] font-label text-[11px] font-medium capitalize leading-[16px] ${PILL[state]}`}
    >
      {state}
    </span>
  );
}

function Swatch({ className, name }: { className: string; name: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`h-8 w-full rounded-md border border-border ${className}`} />
      <span className="font-label text-[10px] leading-[14px] text-tertiary">{name}</span>
    </div>
  );
}

function Foundations() {
  return (
    <div className="flex flex-col gap-4">
      <Label>Foundations</Label>
      <Card className="flex flex-col gap-3">
        <SubLabel>Color</SubLabel>
        <div className="grid grid-cols-3 gap-2">
          <Swatch className="bg-[var(--accent-dark)]" name="Brand" />
          <Swatch className="bg-tars-dark" name="Accent" />
          <Swatch className="bg-[var(--accent-light)]" name="Tint" />
          <Swatch className="bg-primary" name="Text" />
          <Swatch className="bg-surface-media" name="Surface" />
          <Swatch className="bg-tag-green-bg" name="Success" />
        </div>
      </Card>
      <Card className="flex flex-col gap-3">
        <SubLabel>Type</SubLabel>
        <p className="font-label text-[18px] font-semibold leading-[24px] text-primary">Heading</p>
        <p className="font-label text-[14px] font-medium leading-[20px] text-primary">Label</p>
        <p className="font-label text-[13px] leading-[20px] text-secondary">Body text</p>
        <p className="font-label text-[11px] leading-[16px] text-tertiary">Caption</p>
      </Card>
    </div>
  );
}

function Components() {
  return (
    <div className="flex flex-col gap-4">
      <Label>Components</Label>
      <Card className="flex flex-col gap-3">
        <SubLabel>Sync status pill · 4 variants</SubLabel>
        <div className="flex flex-wrap gap-2">
          <StatusPill state="syncing" />
          <StatusPill state="synced" />
          <StatusPill state="failed" />
          <StatusPill state="paused" />
        </div>
      </Card>
      <Card className="flex flex-col gap-3">
        <SubLabel>Button</SubLabel>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-dark)] px-3 py-[6px] font-label text-[12px] font-medium text-surface-page">
            <Plus size={12} weight="bold" aria-hidden="true" />
            Add resource
          </span>
          <span className="inline-flex items-center rounded-md border border-border bg-surface-case-study px-3 py-[6px] font-label text-[12px] font-medium text-primary">
            Sync
          </span>
        </div>
      </Card>
      <Card className="flex flex-col gap-2">
        <SubLabel>Accordion · closed and open</SubLabel>
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 font-label text-[12px] font-medium text-primary">
          <CheckCircle size={14} aria-hidden="true" />
          Step 2: Extract key details
          <CaretDown size={12} className="ml-auto" aria-hidden="true" />
        </div>
        <div className="flex flex-col rounded-lg border border-border">
          <div className="flex items-center gap-2 rounded-t-lg bg-surface-media px-3 py-2 font-label text-[12px] font-medium text-primary">
            <CheckCircle size={14} aria-hidden="true" />
            Step 1: Identify information
            <CaretUp size={12} className="ml-auto" aria-hidden="true" />
          </div>
          <p className="px-3 py-2 font-label text-[11px] leading-[16px] text-secondary">Tool: Slack search</p>
        </div>
      </Card>
    </div>
  );
}

function SourceRow({ name, isPrivate, messages }: { name: string; isPrivate: boolean; messages: string }) {
  const Icon = isPrivate ? Lock : Hash;
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-case-study p-3">
      <div className="flex items-center gap-2 font-label text-[12px] font-medium text-primary">
        <Icon size={13} aria-hidden="true" />
        {name}
        <span className="ml-auto">
          <StatusPill state="syncing" />
        </span>
      </div>
      <div className="flex gap-6 font-label text-[10px] leading-[14px] text-tertiary">
        <span>{isPrivate ? "Private" : "Public"}</span>
        <span>{messages} messages</span>
      </div>
    </div>
  );
}

function InUse() {
  return (
    <div className="flex flex-col gap-4">
      <Label>In use · Knowledge dashboard</Label>
      <div className="flex flex-1 flex-col gap-3 rounded-xl border border-border bg-surface-media p-4">
        <div className="flex items-center justify-between">
          <p className="font-label text-[14px] font-semibold text-primary">Acme Slack Knowledge</p>
          <span className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-dark)] px-2 py-1 font-label text-[11px] font-medium text-surface-page">
            <Plus size={11} weight="bold" aria-hidden="true" />
            Add resource
          </span>
        </div>
        <p className="font-label text-[11px] text-tertiary">Resources uploaded (3)</p>
        <SourceRow name="general" isPrivate={false} messages="53,052" />
        <SourceRow name="uk-team-internal" isPrivate messages="21,842" />
        <SourceRow name="product-updates" isPrivate={false} messages="8,310" />
        <p className="mt-auto font-label text-[10px] text-tertiary">Last sync: 21 Dec 2023</p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <span className="self-center font-label text-[18px] text-muted" aria-hidden="true">
      →
    </span>
  );
}

export default function DesignSystemVisual() {
  return (
    <figure
      className={`grid w-full grid-cols-[1fr_auto_1.1fr_auto_1.3fr] items-stretch gap-5 p-10 ${mediaPanel}`}
      aria-label="Asimov's design system: foundations, then components, then the knowledge dashboard built from them"
    >
      <Foundations />
      <Arrow />
      <Components />
      <Arrow />
      <InUse />
    </figure>
  );
}
