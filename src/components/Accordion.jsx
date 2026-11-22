import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ items, openId, onToggle }) {
  return (
    <div className="border-t border-[#DCE4DC]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `accordion-panel-${item.id}`;
        const buttonId = `accordion-trigger-${item.id}`;

        return (
          <div key={item.id} className="border-b border-[#DCE4DC]">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(isOpen ? null : item.id)}
              className="w-full py-4 px-1 flex items-center justify-between gap-4 text-left text-[#232924] hover:opacity-80 transition-opacity min-h-[52px]"
            >
              <span className="font-serif text-[19px] leading-[26px] font-medium">
                {item.title}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#5C665E] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              data-open={isOpen ? 'true' : 'false'}
              className="accordion-content"
            >
              <div className="accordion-inner">
                <div className="mb-4 rounded-[16px] bg-[#FBF9F6] border border-[#8FA391]/15 p-4 md:p-5 text-[15px] leading-[24px] text-[#232924]">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
