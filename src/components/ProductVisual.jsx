/**
 * Renders crisp inline-SVG botanical apothecary packaging on #F0EDE6 with zero external image requests.
 * If an owner later populates `product.images[idx].src`, it seamlessly renders that image with lazy loading.
 */
export default function ProductVisual({
  product,
  variant = null,
  view = 'front',
  className = '',
}) {
  if (!product) return null;

  const matchedImage =
    (product.images || []).find((img) => img.view === view) || (product.images || [])[0];

  if (matchedImage && matchedImage.src) {
    return (
      <div className={`relative w-full h-full bg-[#F0EDE6] overflow-hidden ${className}`}>
        <img
          src={matchedImage.src}
          alt={matchedImage.alt || product.name}
          loading="lazy"
          width="480"
          height="600"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const sizeText = variant?.label || product.sizeLabel || '';
  const shortTitle = product.name.split('(')[0].trim();

  if (view === 'detail') {
    return (
      <div className={`relative w-full h-full bg-[#F0EDE6] flex items-center justify-center p-5 ${className}`}>
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full"
          role="img"
          aria-label={`${product.name} ingredient label detail`}
        >
          <rect width="320" height="400" fill="#F0EDE6" />
          <circle cx="265" cy="70" r="68" fill="#DCE4DC" opacity="0.65" />
          <rect x="44" y="48" width="232" height="304" rx="18" fill="#FBF9F6" stroke="#8FA391" strokeOpacity="0.45" strokeWidth="1.5" />
          <rect x="58" y="64" width="204" height="272" rx="12" fill="none" stroke="#DCE4DC" strokeWidth="1" />
          <text x="160" y="100" textAnchor="middle" fill="#5C665E" fontSize="10" fontWeight="600" letterSpacing="2">
            BARE &amp; BLOOM
          </text>
          <text x="160" y="118" textAnchor="middle" fill="#8FA391" fontSize="11" fontStyle="italic" fontFamily="Georgia, serif">
            By Robaha
          </text>
          <line x1="88" y1="134" x2="232" y2="134" stroke="#DCE4DC" strokeWidth="1" />
          <text x="160" y="162" textAnchor="middle" fill="#232924" fontSize="14" fontWeight="600" fontFamily="Georgia, serif">
            {shortTitle.slice(0, 24)}
          </text>
          <text x="160" y="182" textAnchor="middle" fill="#5C665E" fontSize="10" letterSpacing="1.2">
            {product.category.toUpperCase()} &middot; {sizeText.toUpperCase()}
          </text>
          <rect x="78" y="206" width="164" height="72" rx="10" fill="#F0EDE6" />
          <text x="160" y="230" textAnchor="middle" fill="#2D3830" fontSize="10.5" fontWeight="600">
            KEY ACTIVES
          </text>
          <text x="160" y="250" textAnchor="middle" fill="#5C665E" fontSize="10">
            {(product.keyIngredients?.[0]?.name || '').slice(0, 26)}
          </text>
          <text x="160" y="266" textAnchor="middle" fill="#5C665E" fontSize="10">
            {(product.keyIngredients?.[1]?.name || '').slice(0, 26)}
          </text>
          <text x="160" y="314" textAnchor="middle" fill="#5C665E" fontSize="9.5" letterSpacing="1.5">
            100% HALAL &middot; CRUELTY-FREE
          </text>
        </svg>
      </div>
    );
  }

  if (view === 'swatch') {
    return (
      <div className={`relative w-full h-full bg-[#F0EDE6] flex items-center justify-center p-5 ${className}`}>
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full"
          role="img"
          aria-label={`${product.name} texture swatch`}
        >
          <rect width="320" height="400" fill="#F0EDE6" />
          <path
            d="M72 230 C64 150, 125 96, 198 110 C258 122, 266 205, 232 264 C198 320, 82 308, 72 230 Z"
            fill="#DCE4DC"
            opacity="0.7"
          />
          <path
            d="M95 215 C92 155, 142 122, 192 138 C234 152, 240 218, 206 254 C172 290, 99 272, 95 215 Z"
            fill="#FBF9F6"
            stroke="#8FA391"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          <ellipse cx="152" cy="184" rx="28" ry="14" transform="rotate(-18 152 184)" fill="#FFFFFF" opacity="0.85" />
          <circle cx="215" cy="145" r="8" fill="#FBF9F6" stroke="#8FA391" strokeOpacity="0.4" />
          <circle cx="116" cy="276" r="5" fill="#FBF9F6" stroke="#8FA391" strokeOpacity="0.4" />
          <text x="160" y="346" textAnchor="middle" fill="#232924" fontSize="13" fontFamily="Georgia, serif" fontStyle="italic">
            {product.extractionNote}
          </text>
          <text x="160" y="366" textAnchor="middle" fill="#5C665E" fontSize="10" letterSpacing="1.5">
            NON-GREASY &middot; HUMIDITY-BALANCED
          </text>
        </svg>
      </div>
    );
  }

  if (view === 'inUse') {
    return (
      <div className={`relative w-full h-full bg-[#F0EDE6] flex items-center justify-center p-5 ${className}`}>
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full"
          role="img"
          aria-label={`${product.name} daily ritual guide`}
        >
          <rect width="320" height="400" fill="#F0EDE6" />
          <circle cx="160" cy="154" r="82" fill="#DCE4DC" opacity="0.55" />
          <circle cx="160" cy="154" r="56" fill="#FBF9F6" stroke="#8FA391" strokeWidth="1.5" strokeOpacity="0.5" />
          {/* Botanical branch */}
          <path d="M160 194 C160 162, 162 134, 166 112" stroke="#2D3830" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M160 144 C144 138, 134 142, 130 152 C140 156, 152 152, 160 144 Z" fill="#8FA391" opacity="0.7" />
          <path d="M162 162 C178 156, 188 160, 192 170 C182 174, 170 170, 162 162 Z" fill="#8FA391" opacity="0.85" />
          <text x="160" y="274" textAnchor="middle" fill="#232924" fontSize="16" fontFamily="Georgia, serif">
            Daily Ritual Step
          </text>
          <text x="160" y="298" textAnchor="middle" fill="#5C665E" fontSize="11">
            Apply gently to clean, damp skin
          </text>
          <text x="160" y="318" textAnchor="middle" fill="#5C665E" fontSize="11">
            Morning &amp; evening comfort
          </text>
          <rect x="96" y="340" width="128" height="24" rx="12" fill="#DCE4DC" />
          <text x="160" y="356" textAnchor="middle" fill="#2D3830" fontSize="10" fontWeight="600" letterSpacing="1.2">
            DERMATOLOGIST TESTED
          </text>
        </svg>
      </div>
    );
  }

  // Default 'front' apothecary silhouette tailored per product visualType
  return (
    <div className={`relative w-full h-full bg-[#F0EDE6] flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 320 400"
        className="w-full h-full"
        role="img"
        aria-label={`${product.name} ${sizeText}`}
      >
        <defs>
          <linearGradient id={`glass-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#A6B8A8" />
            <stop offset="55%" stopColor="#8FA391" />
            <stop offset="100%" stopColor="#6D8270" />
          </linearGradient>
        </defs>
        <rect width="320" height="400" fill="#F0EDE6" />
        {/* Soft travertine pedestal shadow */}
        <ellipse cx="160" cy="346" rx="84" ry="14" fill="#DDD7CB" />
        {/* Botanical halo */}
        <circle cx="160" cy="188" r="106" fill="#DCE4DC" opacity="0.55" />

        {product.visualType === 'dropper' && (
          <g>
            {/* Dropper rubber bulb + collar */}
            <rect x="148" y="64" width="24" height="32" rx="12" fill="#2D3830" />
            <rect x="140" y="92" width="40" height="16" rx="4" fill="#232924" />
            <rect x="144" y="108" width="32" height="14" rx="3" fill="#B6C4B7" />
            {/* Bottle shoulder & body */}
            <path
              d="M120 138 C120 124, 134 120, 160 120 C186 120, 200 124, 200 138 L206 322 C206 334, 196 340, 160 340 C124 340, 114 334, 114 322 Z"
              fill={`url(#glass-${product.id})`}
            />
            <rect x="122" y="164" width="76" height="136" rx="6" fill="#FBF9F6" />
            <text x="160" y="192" textAnchor="middle" fill="#232924" fontSize="8.5" fontWeight="600" letterSpacing="1.6">
              BARE &amp; BLOOM
            </text>
            <text x="160" y="206" textAnchor="middle" fill="#5C665E" fontSize="8.5" fontStyle="italic" fontFamily="Georgia, serif">
              By Robaha
            </text>
            <line x1="136" y1="216" x2="184" y2="216" stroke="#DCE4DC" strokeWidth="1" />
            <text x="160" y="236" textAnchor="middle" fill="#232924" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
              Vitamin C + E
            </text>
            <text x="160" y="252" textAnchor="middle" fill="#5C665E" fontSize="8.5">
              Brightening Serum
            </text>
            <text x="160" y="284" textAnchor="middle" fill="#2D3830" fontSize="9" fontWeight="700">
              {sizeText}
            </text>
          </g>
        )}

        {product.visualType === 'pump' && (
          <g>
            {/* Pump nozzle */}
            <path d="M138 66 L176 66 L176 76 L154 76 L154 90 L144 90 L144 76 L138 76 Z" fill="#2D3830" />
            <rect x="142" y="90" width="36" height="16" rx="4" fill="#232924" />
            {/* Cleanser cylinder */}
            <rect x="108" y="108" width="104" height="230" rx="22" fill="#FBF9F6" stroke="#8FA391" strokeWidth="2" />
            <rect x="108" y="108" width="104" height="24" rx="10" fill="#DCE4DC" />
            <rect x="118" y="156" width="84" height="148" rx="8" fill="#DCE4DC" opacity="0.55" />
            <text x="160" y="186" textAnchor="middle" fill="#232924" fontSize="9" fontWeight="600" letterSpacing="1.6">
              BARE &amp; BLOOM
            </text>
            <text x="160" y="200" textAnchor="middle" fill="#5C665E" fontSize="8.5" fontStyle="italic" fontFamily="Georgia, serif">
              By Robaha
            </text>
            <line x1="132" y1="212" x2="188" y2="212" stroke="#8FA391" strokeOpacity="0.4" />
            <text x="160" y="234" textAnchor="middle" fill="#232924" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
              Ceramide &amp; Oat
            </text>
            <text x="160" y="250" textAnchor="middle" fill="#5C665E" fontSize="9">
              Barrier Cleanser
            </text>
            <text x="160" y="286" textAnchor="middle" fill="#2D3830" fontSize="9.5" fontWeight="700">
              {sizeText}
            </text>
          </g>
        )}

        {product.visualType === 'toner' && (
          <g>
            {/* Wood-sage cap */}
            <rect x="136" y="72" width="48" height="34" rx="8" fill="#2D3830" />
            <rect x="144" y="106" width="32" height="10" fill="#8FA391" />
            {/* Frosted tall bottle */}
            <rect x="114" y="116" width="92" height="224" rx="18" fill={`url(#glass-${product.id})`} opacity="0.92" />
            <rect x="124" y="156" width="72" height="148" rx="6" fill="#FBF9F6" />
            <text x="160" y="184" textAnchor="middle" fill="#232924" fontSize="8.5" fontWeight="600" letterSpacing="1.5">
              BARE &amp; BLOOM
            </text>
            <text x="160" y="198" textAnchor="middle" fill="#5C665E" fontSize="8.5" fontStyle="italic" fontFamily="Georgia, serif">
              By Robaha
            </text>
            <line x1="134" y1="210" x2="186" y2="210" stroke="#DCE4DC" />
            <text x="160" y="232" textAnchor="middle" fill="#232924" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
              Niacinamide
            </text>
            <text x="160" y="248" textAnchor="middle" fill="#232924" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
              &amp; Rice Toner
            </text>
            <text x="160" y="284" textAnchor="middle" fill="#2D3830" fontSize="9.5" fontWeight="700">
              {sizeText}
            </text>
          </g>
        )}

        {product.visualType === 'jar' && (
          <g>
            {/* Minimalist wide apothecary jar */}
            <rect x="92" y="170" width="136" height="28" rx="8" fill="#2D3830" />
            <rect x="88" y="198" width="144" height="136" rx="20" fill="#FBF9F6" stroke="#8FA391" strokeWidth="2" />
            <rect x="102" y="218" width="116" height="94" rx="8" fill="#DCE4DC" opacity="0.5" />
            <text x="160" y="242" textAnchor="middle" fill="#232924" fontSize="8.5" fontWeight="600" letterSpacing="1.6">
              BARE &amp; BLOOM
            </text>
            <text x="160" y="262" textAnchor="middle" fill="#232924" fontSize="11" fontFamily="Georgia, serif" fontWeight="600">
              Peptide &amp; Squalane
            </text>
            <text x="160" y="278" textAnchor="middle" fill="#5C665E" fontSize="9">
              Recovery Balm
            </text>
            <text x="160" y="298" textAnchor="middle" fill="#2D3830" fontSize="9.5" fontWeight="700">
              {sizeText}
            </text>
          </g>
        )}

        {product.visualType === 'bundle' && (
          <g>
            {/* Gift box backdrop */}
            <rect x="64" y="114" width="192" height="222" rx="16" fill="#DCE4DC" stroke="#8FA391" strokeOpacity="0.4" />
            {/* Cleanser left */}
            <rect x="82" y="138" width="54" height="176" rx="12" fill="#FBF9F6" stroke="#8FA391" strokeWidth="1.5" />
            <rect x="99" y="118" width="20" height="20" rx="4" fill="#2D3830" />
            {/* Toner middle */}
            <rect x="139" y="128" width="50" height="186" rx="12" fill="#8FA391" />
            <rect x="150" y="106" width="28" height="22" rx="5" fill="#2D3830" />
            <rect x="145" y="168" width="38" height="106" rx="4" fill="#FBF9F6" />
            {/* Serum right */}
            <rect x="192" y="174" width="44" height="140" rx="10" fill="#6D8270" />
            <rect x="206" y="144" width="16" height="30" rx="8" fill="#232924" />
            <rect x="198" y="206" width="32" height="80" rx="4" fill="#FBF9F6" />
            {/* Bundle Ribbon Label */}
            <rect x="84" y="264" width="152" height="44" rx="10" fill="#2D3830" />
            <text x="160" y="284" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily="Georgia, serif">
              Complete Daily Ritual
            </text>
            <text x="160" y="299" textAnchor="middle" fill="#DCE4DC" fontSize="8.5" fontWeight="600" letterSpacing="1.2">
              3-PIECE SET
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
