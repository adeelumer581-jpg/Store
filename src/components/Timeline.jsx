import React from 'react';
import { Check } from 'lucide-react';
import { getEstimatedOrderStatus, ORDER_TIMELINE_STEPS } from '../lib/orderService.js';

export default function Timeline({ createdAt }) {
  const { activeIndex } = getEstimatedOrderStatus(createdAt);

  return (
    <div className="bg-white rounded-[24px] border border-[#8FA391]/20 p-5 md:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h2 className="font-serif text-[22px] leading-[28px] font-medium text-[#232924]">
          Order Progress
        </h2>
        <span className="text-[13px] font-semibold text-[#2D3830]">
          Current stage: {ORDER_TIMELINE_STEPS[activeIndex]}
        </span>
      </div>

      <ol className="space-y-4">
        {ORDER_TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          return (
            <li key={step} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-[#2D3830] text-white'
                      : 'border-[1.5px] border-[#8FA391] bg-white text-[#5C665E]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" aria-hidden="true" /> : idx + 1}
                </span>
                {idx < ORDER_TIMELINE_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`w-0.5 h-6 mt-1 ${
                      idx < activeIndex ? 'bg-[#2D3830]' : 'bg-[#DCE4DC]'
                    }`}
                  />
                )}
              </div>

              <div className="pt-0.5">
                <p
                  className={`text-[15px] font-semibold ${
                    isCompleted ? 'text-[#232924]' : 'text-[#5C665E]'
                  }`}
                >
                  {step}
                </p>
                {isCurrent && (
                  <p className="text-[13px] text-[#5C665E]">
                    Active milestone for your parcel
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 pt-4 border-t border-[#8FA391]/15 text-[13px] text-[#5C665E]">
        Status updates are estimates based on your order time.
      </p>
    </div>
  );
}
