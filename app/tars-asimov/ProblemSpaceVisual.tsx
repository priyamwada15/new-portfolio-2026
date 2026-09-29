import { mediaPanel } from "@/design-system";

const PAINS = [
  {
    title: "Repeat questions",
    text: "The same API failure, asked again months later",
  },
  {
    title: "Buried answers",
    text: "The fix lived in a long thread that Slack's search couldn't surface",
  },
  {
    title: "Context copied by hand",
    text: "The answer carried into HubSpot or a client report, one tool at a time",
  },
] as const;

/** Numbered badge tying a spot in the thread to its pain in the list. */
function Marker({ n }: { n: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-dark)] font-label text-[12px] font-semibold text-surface-page">
      {n}
    </span>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-light)] font-label text-[12px] font-semibold text-[var(--accent-dark)]">
      {initials}
    </span>
  );
}

function Message({
  initials,
  name,
  time,
  marker,
  children,
}: {
  initials: string;
  name: string;
  time: string;
  marker?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Avatar initials={initials} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="font-label text-[14px] leading-[20px]">
          <span className="font-semibold text-primary">{name}</span>{" "}
          <span className="text-[12px] text-tertiary">{time}</span>
        </p>
        <div className="font-label text-[14px] leading-[22px] text-secondary">{children}</div>
      </div>
      {marker && <Marker n={marker} />}
    </div>
  );
}

function ToolChip({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-border bg-surface-page px-2 py-[2px] font-label text-[12px] leading-[18px] text-secondary">
      {label}
    </span>
  );
}

/**
 * The problem space in one picture: a Slack thread where each of the three pains
 * shows up, numbered to match the list beside it, with the How might we below.
 */
export default function ProblemSpaceVisual() {
  return (
    <figure className={`flex w-full flex-col gap-10 p-12 ${mediaPanel}`}>
      <div className="flex w-full items-center gap-12">
        {/* Slack thread */}
        <div className="flex min-w-0 flex-[1.15] flex-col overflow-hidden rounded-2xl border border-border bg-surface-case-study shadow-[0_0_24px_rgba(0,0,0,0.04)]">
          <div className="border-b border-border px-5 py-3 font-label text-[14px] font-semibold text-primary">
            # client-escalations
          </div>
          <div className="flex flex-col gap-5 px-5 py-5">
            <Message initials="CS" name="CS rep" time="10:42 AM" marker={1}>
              Acme&rsquo;s API calls are failing again. Didn&rsquo;t we fix this before?
            </Message>
            <Message initials="EL" name="Eng lead" time="10:58 AM" marker={2}>
              <span>Yes, back in March. Let me find the thread&hellip;</span>
              <span className="mt-2 flex w-fit items-center gap-2 rounded-md bg-surface-page px-2 py-1 text-[12px] leading-[18px] text-tertiary">
                <span className="font-semibold text-[var(--accent-dark)]">64 replies</span>
                Last reply 5 months ago
              </span>
            </Message>
            <Message initials="CS" name="CS rep" time="11:20 AM" marker={3}>
              <span>Thanks! Updating the client now.</span>
              <span className="mt-2 flex flex-wrap items-center gap-2">
                <ToolChip label="HubSpot" />
                <ToolChip label="Client report" />
              </span>
            </Message>
          </div>
        </div>

        {/* Pains */}
        <ol className="flex min-w-0 flex-1 flex-col gap-6">
          {PAINS.map((pain, i) => (
            <li key={pain.title} className="flex items-start gap-3">
              <Marker n={i + 1} />
              <div className="flex flex-col gap-1">
                <p className="font-label text-[16px] font-semibold leading-[24px] text-primary">
                  {pain.title}
                </p>
                <p className="font-label text-[14px] leading-[22px] text-secondary">{pain.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* How might we */}
      <figcaption className="rounded-2xl bg-[var(--accent-light)] px-8 py-6 font-label text-[18px] font-medium leading-[1.6] text-primary">
        <span className="text-[var(--accent-dark)]">How might we</span>{" "}give startup teams an AI
        assistant in Slack that can find answers across their conversations and docs and act in
        their other tools, while they decide what it can see and do?
      </figcaption>
    </figure>
  );
}
