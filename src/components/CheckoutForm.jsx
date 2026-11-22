import { useRef, useState } from 'react';

import { Lock } from 'lucide-react';
import { STORE_CONFIG } from '../config/store.js';
import { formatPKR } from '../lib/pricing.js';
import {
  sanitizeCheckoutValues,
  validateCheckoutField,
  validateCheckoutForm,
} from '../lib/validation.js';

export default function CheckoutForm({
  values,
  onChange,
  totals,
  onSubmitOrder,
}) {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submitLockRef = useRef(false);

  const fieldRefs = {
    fullName: useRef(null),
    phone: useRef(null),
    email: useRef(null),
    streetAddress: useRef(null),
    city: useRef(null),
    postalCode: useRef(null),
  };

  const handleFieldChange = (name, nextValue) => {
    onChange({ ...values, [name]: nextValue });
    if (touched[name]) {
      const fieldError = validateCheckoutField(name, nextValue);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleFieldBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateCheckoutField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitLockRef.current || submitting) return;

    const validation = validateCheckoutForm(values);
    setTouched({
      fullName: true,
      phone: true,
      email: true,
      streetAddress: true,
      city: true,
      postalCode: true,
    });
    setErrors(validation.errors);

    if (!validation.valid) {
      const firstKey = validation.firstErrorField;
      const targetEl = firstKey ? fieldRefs[firstKey]?.current : null;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => targetEl.focus(), 120);
      }
      return;
    }

    submitLockRef.current = true;
    setSubmitting(true);
    try {
      const sanitized = sanitizeCheckoutValues(values);
      await onSubmitOrder(sanitized);
    } finally {
      submitLockRef.current = false;
      setSubmitting(false);
    }
  };

  const inputBaseClass = (fieldName) =>
    `w-full min-h-[48px] rounded-full bg-white px-5 py-3 text-[16px] text-[#232924] placeholder:text-[#5C665E]/70 border transition-colors ${
      errors[fieldName] ? 'border-[#BA1A1A]' : 'border-[#8FA391]/35'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Contact Details */}
      <section className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-7">
        <h2 className="font-serif text-[24px] leading-[32px] font-normal text-[#232924] mb-5">
          Contact Information
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="checkout-fullName"
              className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
            >
              Full Name *
            </label>
            <input
              ref={fieldRefs.fullName}
              id="checkout-fullName"
              name="fullName"
              type="text"
              required
              autoComplete="name"
              enterKeyHint="next"
              value={values.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              onBlur={() => handleFieldBlur('fullName')}
              placeholder="e.g. Ayesha Khan"
              aria-invalid={errors.fullName ? 'true' : 'false'}
              aria-describedby={errors.fullName ? 'error-fullName' : undefined}
              className={inputBaseClass('fullName')}
            />
            {errors.fullName && (
              <p id="error-fullName" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
              >
                Mobile Number (Pakistan) *
              </label>
              <input
                ref={fieldRefs.phone}
                id="checkout-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                required
                autoComplete="tel"
                enterKeyHint="next"
                value={values.phone}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                onBlur={() => handleFieldBlur('phone')}
                placeholder="0300 1234567"
                aria-invalid={errors.phone ? 'true' : 'false'}
                aria-describedby={errors.phone ? 'error-phone' : 'hint-phone'}
                className={inputBaseClass('phone')}
              />
              {errors.phone ? (
                <p id="error-phone" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                  {errors.phone}
                </p>
              ) : (
                <p id="hint-phone" className="mt-1.5 px-2 text-[12px] text-[#5C665E]">
                  Courier calls or texts this number before delivery.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-email"
                className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
              >
                Email (Optional)
              </label>
              <input
                ref={fieldRefs.email}
                id="checkout-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                value={values.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => handleFieldBlur('email')}
                placeholder="you@example.com"
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'error-email' : undefined}
                className={inputBaseClass('email')}
              />
              {errors.email && (
                <p id="error-email" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Address */}
      <section className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-7">
        <h2 className="font-serif text-[24px] leading-[32px] font-normal text-[#232924] mb-5">
          Delivery Address
        </h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="checkout-streetAddress"
              className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
            >
              Street Address *
            </label>
            <input
              ref={fieldRefs.streetAddress}
              id="checkout-streetAddress"
              name="streetAddress"
              type="text"
              required
              autoComplete="street-address"
              enterKeyHint="next"
              value={values.streetAddress}
              onChange={(e) => handleFieldChange('streetAddress', e.target.value)}
              onBlur={() => handleFieldBlur('streetAddress')}
              placeholder="House/Flat No., Street, Sector/Block & Landmark"
              aria-invalid={errors.streetAddress ? 'true' : 'false'}
              aria-describedby={errors.streetAddress ? 'error-streetAddress' : undefined}
              className={inputBaseClass('streetAddress')}
            />
            {errors.streetAddress && (
              <p id="error-streetAddress" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                {errors.streetAddress}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="checkout-city"
                className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
              >
                City *
              </label>
              <select
                ref={fieldRefs.city}
                id="checkout-city"
                name="city"
                required
                autoComplete="address-level2"
                value={values.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                onBlur={() => handleFieldBlur('city')}
                aria-invalid={errors.city ? 'true' : 'false'}
                aria-describedby={errors.city ? 'error-city' : undefined}
                className={`${inputBaseClass('city')} appearance-none pr-10`}
              >
                {STORE_CONFIG.CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p id="error-city" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-postalCode"
                className="block text-[12px] font-semibold uppercase tracking-[0.06em] text-[#232924] mb-1.5"
              >
                Postal Code (5 digits) *
              </label>
              <input
                ref={fieldRefs.postalCode}
                id="checkout-postalCode"
                name="postalCode"
                type="text"
                inputMode="numeric"
                maxLength={5}
                required
                autoComplete="postal-code"
                enterKeyHint="done"
                value={values.postalCode}
                onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                onBlur={() => handleFieldBlur('postalCode')}
                placeholder="54000"
                aria-invalid={errors.postalCode ? 'true' : 'false'}
                aria-describedby={errors.postalCode ? 'error-postalCode' : undefined}
                className={inputBaseClass('postalCode')}
              />
              {errors.postalCode && (
                <p id="error-postalCode" role="alert" className="mt-1.5 px-2 text-[13px] font-medium text-[#BA1A1A]">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Method */}
      <section className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-7">
        <h2 className="font-serif text-[24px] leading-[32px] font-normal text-[#232924] mb-5">
          Payment Method
        </h2>

        <div role="radiogroup" aria-label="Payment method" className="space-y-3">
          {/* COD Radio Card */}
          <label
            htmlFor="pay-cod"
            className={`block cursor-pointer rounded-[18px] border p-4 transition-colors ${
              values.paymentMethod === 'cod'
                ? 'border-[#2D3830] bg-[#FBF9F6]'
                : 'border-[#8FA391]/30 bg-white hover:bg-[#FBF9F6]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <input
                id="pay-cod"
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={values.paymentMethod === 'cod'}
                onChange={() => onChange({ ...values, paymentMethod: 'cod' })}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                  values.paymentMethod === 'cod'
                    ? 'bg-[#2D3830]'
                    : 'border-[1.5px] border-[#8FA391] bg-white'
                }`}
              >
                {values.paymentMethod === 'cod' && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <div>
                <span className="block text-[15px] font-semibold text-[#232924]">
                  Cash on Delivery (COD)
                </span>
                <span className="block text-[13px] text-[#5C665E] mt-0.5">
                  Pay in cash when your parcel arrives in {STORE_CONFIG.DELIVERY_DAYS} business days.
                </span>
              </div>
            </div>
          </label>

          {/* Bank Transfer / Raast / JazzCash / EasyPaisa Radio Card */}
          <label
            htmlFor="pay-bank"
            className={`block cursor-pointer rounded-[18px] border p-4 transition-colors ${
              values.paymentMethod === 'bank'
                ? 'border-[#2D3830] bg-[#FBF9F6]'
                : 'border-[#8FA391]/30 bg-white hover:bg-[#FBF9F6]'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <input
                id="pay-bank"
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={values.paymentMethod === 'bank'}
                onChange={() => onChange({ ...values, paymentMethod: 'bank' })}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                  values.paymentMethod === 'bank'
                    ? 'bg-[#2D3830]'
                    : 'border-[1.5px] border-[#8FA391] bg-white'
                }`}
              >
                {values.paymentMethod === 'bank' && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-[#232924]">
                  Bank Transfer / Raast / JazzCash / EasyPaisa
                </span>
                <span className="block text-[13px] text-[#5C665E] mt-0.5">
                  Transfer directly after placing your order and share your screenshot.
                </span>
              </div>
            </div>
          </label>
        </div>

        {values.paymentMethod === 'bank' && (
          <div className="mt-4 rounded-[18px] bg-[#DCE4DC]/55 border border-[#8FA391]/30 p-4 md:p-5 text-[14px] text-[#232924] space-y-2">
            <p className="font-semibold text-[#2D3830]">
              Transfer Instructions (Placeholder Accounts — Replace Before Launch)
            </p>
            <dl className="space-y-1 text-[13px]">
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Account Title:</dt>
                <dd>{STORE_CONFIG.PAYMENT_ACCOUNTS.accountTitle}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Bank / Raast:</dt>
                <dd>{STORE_CONFIG.PAYMENT_ACCOUNTS.bankName}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">Account / IBAN:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.ibanOrAccount}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">JazzCash:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.jazzCash}</dd>
              </div>
              <div className="flex flex-wrap gap-x-2">
                <dt className="font-semibold text-[#5C665E]">EasyPaisa:</dt>
                <dd className="tabular-nums">{STORE_CONFIG.PAYMENT_ACCOUNTS.easyPaisa}</dd>
              </div>
            </dl>
            <p className="pt-1 font-serif italic text-[15px] text-[#2D3830]">
              {STORE_CONFIG.PAYMENT_ACCOUNTS.screenshotNote}
            </p>
          </div>
        )}
      </section>

      {/* Place Order Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-[#2D3830] hover:bg-[#3D4C41] disabled:opacity-60 disabled:cursor-not-allowed text-white text-[15px] font-semibold tracking-[0.04em] uppercase py-4 px-8 min-h-[54px] inline-flex items-center justify-center gap-2.5 transition-colors duration-200"
        >
          <Lock className="w-4 h-4" aria-hidden="true" />
          <span>
            {submitting
              ? 'Placing Your Order...'
              : `Place Order \u00B7 ${formatPKR(totals?.total)}`}
          </span>
        </button>
      </div>
    </form>
  );
}
