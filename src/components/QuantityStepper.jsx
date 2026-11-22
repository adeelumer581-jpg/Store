import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
  itemLabel = 'item',
}) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div className="inline-flex items-center rounded-full border border-[#8FA391]/35 bg-white">
      <button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        aria-label={`Decrease quantity for ${itemLabel}`}
        className="inline-flex items-center justify-center w-11 h-11 rounded-l-full text-[#232924] hover:bg-[#DCE4DC]/60 active:bg-[#DCE4DC] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>

      <span
        aria-live="polite"
        className="min-w-[32px] text-center text-[14px] font-semibold text-[#232924] tabular-nums select-none"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        aria-label={`Increase quantity for ${itemLabel}`}
        className="inline-flex items-center justify-center w-11 h-11 rounded-r-full text-[#232924] hover:bg-[#DCE4DC]/60 active:bg-[#DCE4DC] disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
