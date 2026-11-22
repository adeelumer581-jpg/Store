import { useState } from 'react';

import logoAsset from '../assets/logo.png';

export default function BrandLogo({ className = '', sizeClass = 'h-[60px] md:h-[72px]' }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`inline-flex flex-col leading-none text-[#232924] ${className}`}>
        <span className="font-serif text-[20px] md:text-[24px] font-normal tracking-tight whitespace-nowrap">
          Bare &amp; Bloom
        </span>
        <span className="font-serif italic text-[12px] md:text-[13px] tracking-[0.04em] text-[#232924]/90 whitespace-nowrap">
          By Robaha
        </span>
      </span>
    );
  }

  return (
    <img
      src={logoAsset}
      alt="Bare & Bloom By Robaha"
      onError={() => setFailed(true)}
      className={`${sizeClass} w-auto object-contain select-none ${className}`}
    />
  );
}
