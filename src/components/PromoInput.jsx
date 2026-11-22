import { useState } from 'react';

import { Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function PromoInput() {
  const { promoCode, applyPromo, removePromo } = useCart();
  const { showToast } = useToast();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = applyPromo(input);
    if (!res.valid) {
      setError(res.error);
      return;
    }
    setError('');
    setInput('');
    showToast(`Promo code ${res.code} applied — 10% off!`);
  };

  if (promoCode) {
    return (
      <div className="rounded-[18px] bg-[#DCE4DC] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#2D3830]">
          <Tag className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>
            Code <strong className="tracking-[0.04em]">{promoCode}</strong> applied (10% off)
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            removePromo();
            setError('');
            showToast('Promo code removed.');
          }}
          aria-label={`Remove promo code ${promoCode}`}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#2D3830] hover:bg-white/60 active:bg-white/80 transition-colors"
        >
          <X className="w-3.5 h-3.5" aria-hidden="true" />
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="cart-promo-input"
        className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
      >
        Promo Code
      </label>
      <div className="flex items-center gap-2">
        <input
          id="cart-promo-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (error) setError('');
          }}
          placeholder="Try GLOW10"
          autoCapitalize="characters"
          autoCorrect="off"
          enterKeyHint="done"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'cart-promo-error' : undefined}
          className={`flex-1 min-w-0 min-h-[48px] rounded-full bg-white px-5 py-2.5 text-[16px] text-[#232924] placeholder:text-[#5C665E]/70 border ${
            error ? 'border-[#BA1A1A]' : 'border-[#8FA391]/35'
          }`}
        />
        <button
          type="submit"
          className="rounded-full border-[1.5px] border-[#2D3830] bg-transparent hover:bg-[#DCE4DC] active:bg-[#DCE4DC] text-[#232924] text-[13px] font-semibold px-5 min-h-[48px] whitespace-nowrap shrink-0 transition-colors"
        >
          Apply
        </button>
      </div>
      {error && (
        <p id="cart-promo-error" role="alert" className="mt-1.5 text-[13px] font-medium text-[#BA1A1A] px-2">
          {error}
        </p>
      )}
    </form>
  );
}
