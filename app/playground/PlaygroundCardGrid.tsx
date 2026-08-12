type PlaceholderCard = {
  id: string;
  title: string;
  date: string;
};

const PLACEHOLDER_CARDS: PlaceholderCard[] = [
  { id: "card-1", title: "Experiment One", date: "01 Jan 26" },
  { id: "card-2", title: "Experiment Two", date: "02 Jan 26" },
  { id: "card-3", title: "Experiment Three", date: "03 Jan 26" },
  { id: "card-4", title: "Experiment Four", date: "04 Jan 26" },
  { id: "card-5", title: "Experiment Five", date: "05 Jan 26" },
  { id: "card-6", title: "Experiment Six", date: "06 Jan 26" },
];

export function PlaygroundCardGrid() {
  return (
    <div className="relative z-[1] mx-auto w-[86%] max-w-[1008px] pt-[32px] pb-[96px] xl:pt-[72px]">
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 tablet:grid-cols-2">
        {PLACEHOLDER_CARDS.map((card) => (
          <div key={card.id} className="flex flex-col gap-3">
            <div className="aspect-square w-full rounded-2xl bg-surface-card" />
            <div className="flex items-baseline justify-between">
              <span className="text-ink">{card.title}</span>
              <span className="text-muted text-sm">{card.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
