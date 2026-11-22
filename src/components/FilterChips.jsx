export default function FilterChips({ categories, activeCategory, counts = {}, onSelect }) {
  return (
    <div
      role="group"
      aria-label="Filter products by category"
      className="flex flex-wrap items-center gap-2.5"
    >
      {categories.map((cat) => {
        const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
        const count = counts[cat] ?? 0;
        return (
          <button
            key={cat}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(cat)}
            className={`rounded-full px-4 py-2.5 min-h-[44px] text-[13px] font-semibold tracking-[0.03em] whitespace-nowrap shrink-0 transition-colors duration-200 ${
              isActive
                ? 'bg-[#2D3830] text-white border border-[#2D3830]'
                : 'bg-white text-[#232924] border border-[#8FA391]/35 hover:bg-[#DCE4DC]/50 active:bg-[#DCE4DC]'
            }`}
          >
            {cat} <span className="tabular-nums opacity-80">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
