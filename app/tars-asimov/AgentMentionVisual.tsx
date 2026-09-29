import { mediaPanel } from "@/design-system";

const TEAM_AGENTS = ["engineering", "sales", "marketing", "customer-success", "design"] as const;

function BotRow({ handle, active = false }: { handle: string; active?: boolean }) {
  return (
    <li
      className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
        active ? "bg-[var(--accent-light)]" : ""
      }`}
    >
      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--accent-dark)] font-label text-[13px] font-semibold text-surface-page">
        A
      </span>
      <span className="min-w-0 truncate font-label text-[14px] font-medium text-primary">{handle}</span>
      <span className="ml-auto shrink-0 rounded border border-border px-[5px] font-label text-[10px] font-semibold leading-[16px] text-tertiary">
        APP
      </span>
    </li>
  );
}

/** A Slack message box with the @-mention autocomplete open above it. */
function MentionBox({
  label,
  caption,
  handles,
}: {
  label: string;
  caption: string;
  handles: readonly string[];
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <p className="font-label text-[14px] font-semibold leading-[21px] text-[var(--accent-dark)]">
        {label}
      </p>
      <div className="flex flex-1 flex-col justify-end gap-2">
        <ul className="flex flex-col gap-1 rounded-2xl border border-border bg-surface-case-study p-2 shadow-[0_0_24px_rgba(0,0,0,0.04)]">
          {handles.map((handle, i) => (
            <BotRow key={handle} handle={handle} active={i === 0} />
          ))}
        </ul>
        <div className="flex items-center rounded-2xl border border-border bg-surface-case-study px-4 py-3 font-label text-[14px] text-primary">
          @asi
          <span className="ml-[1px] inline-block h-[18px] w-[1.5px] bg-primary" aria-hidden="true" />
        </div>
      </div>
      <p className="font-label text-[14px] leading-[22px] text-secondary">{caption}</p>
    </div>
  );
}

/**
 * The structural decision as a user would feel it: typing "@asi" in Slack
 * lists one agent per team in the early direction, and a single Asimov in
 * what shipped.
 */
export default function AgentMentionVisual() {
  return (
    <figure className={`flex w-full items-stretch gap-12 p-12 ${mediaPanel}`}>
      <MentionBox
        label="Early direction"
        handles={TEAM_AGENTS.map((team) => `asimov-${team}`)}
        caption="One agent per team, so five bots to set up, manage and choose between"
      />
      <MentionBox
        label="What shipped"
        handles={["asimov"]}
        caption="One agent that held every team's context, with each team's sources managed separately"
      />
    </figure>
  );
}
