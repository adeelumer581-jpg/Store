/**
 * Single source of truth for Bare & Bloom by Robaha product catalog.
 * Note on reviews: All reviews below are marked `sample: true` — replace with
 * verified customer reviews before launch.
 * Note on images: `src` is null so inline <ProductVisual /> SVG artwork renders
 * with zero network requests; drop real image paths/URLs into `src` anytime.
 */

export const CATEGORIES = ['All', 'Serums', 'Cleansers', 'Toners', 'Bundles'];

export const PRODUCTS = [
  {
    id: 'bb-vitc-serum',
    slug: 'vitamin-c-e-brightening-serum',
    name: 'Vitamin C + E Brightening Serum',
    category: 'Serums',
    tagline: 'Evens skin tone & boosts daily radiance',
    extractionNote: 'Cold-pressed Citrus & Ferulic Complex',
    price: 1850,
    sizeLabel: '30ml',
    variants: [
      { id: '30ml', label: '30ml', price: 1850 },
      // Placeholder price for 50ml size — owner may adjust before launch
      { id: '50ml', label: '50ml', price: 2650 },
    ],
    rating: 4.9,
    reviewCount: 42,
    badges: ['New', 'Bestseller'],
    inStock: true,
    visualType: 'dropper',
    accentTint: '#8FA391',
    images: [
      { id: 'front', label: 'Front Bottle', view: 'front', src: null, alt: 'Vitamin C + E Brightening Serum front bottle' },
      { id: 'detail', label: 'Label & Active %', view: 'detail', src: null, alt: 'Vitamin C + E Brightening Serum ingredient label detail' },
      { id: 'swatch', label: 'Serum Texture', view: 'swatch', src: null, alt: 'Lightweight amber-clear serum drop swatch' },
      { id: 'in-use', label: 'Daily Ritual', view: 'inUse', src: null, alt: 'Morning skincare ritual application guide' },
    ],
    keyIngredients: [
      {
        name: '10% Stabilized Vitamin C (SAP)',
        benefit: 'Gently brightens dullness and uneven tone without stinging sensitive skin in warm humidity.',
      },
      {
        name: '1% Vitamin E (Tocopherol)',
        benefit: 'Supports antioxidant defence against daily urban pollution and UV stress.',
      },
      {
        name: '0.5% Ferulic & Licorice Root',
        benefit: 'Helps calm visible redness and leaves skin looking visibly rested and luminous.',
      },
    ],
    howToUse: [
      'After cleansing and toning, dispense 3–4 drops onto fingertips.',
      'Press gently across damp face and neck every morning.',
      'Follow with your favourite moisturizer and broad-spectrum SPF.',
    ],
    skinType: 'Suitable for all skin types, including combination, dull, and humidity-prone Pakistani skin. Fragrance-free and non-comedogenic.',
    shippingCodNote: 'Dispatched within 24 hours across Pakistan. Cash on Delivery available nationwide; free shipping on orders PKR 3,000+.',
    reviews: [
      {
        id: 'rev-vc-1',
        sample: true,
        author: 'Ayesha K.',
        city: 'Lahore',
        rating: 5,
        date: '2026-10-14',
        text: 'Absorbs in seconds even in Lahore humidity. My morning skin looks brighter without any sticky film.',
      },
      {
        id: 'rev-vc-2',
        sample: true,
        author: 'Zainab M.',
        city: 'Karachi',
        rating: 5,
        date: '2026-10-28',
        text: 'Most Vitamin C serums tingle on my cheeks, but this one feels soothing and layers cleanly under sunscreen.',
      },
      {
        id: 'rev-vc-3',
        sample: true,
        author: 'Hira S.',
        city: 'Islamabad',
        rating: 4,
        date: '2026-11-04',
        text: 'Subtle natural finish and zero synthetic perfume. Already ordering the larger 50ml bottle next.',
      },
    ],
  },
  {
    id: 'bb-ceramide-cleanser',
    slug: 'ceramide-oat-barrier-cleanser',
    name: 'Ceramide & Oat Barrier Cleanser',
    category: 'Cleansers',
    tagline: 'Gently cleanses while repairing skin barrier',
    extractionNote: 'Colloidal Oat & Botanical Ceramide Milk',
    price: 1450,
    sizeLabel: '150ml',
    variants: [
      { id: '150ml', label: '150ml', price: 1450 },
    ],
    rating: 4.8,
    reviewCount: 36,
    badges: ['Bestseller'],
    inStock: true,
    visualType: 'pump',
    accentTint: '#7A8E7C',
    images: [
      { id: 'front', label: 'Front Bottle', view: 'front', src: null, alt: 'Ceramide & Oat Barrier Cleanser pump bottle' },
      { id: 'detail', label: 'pH & Formula', view: 'detail', src: null, alt: 'pH 5.5 barrier-safe cleanser specification' },
      { id: 'swatch', label: 'Creamy Gel Texture', view: 'swatch', src: null, alt: 'Non-stripping oat milk gel swatch' },
      { id: 'in-use', label: 'Evening Cleanse', view: 'inUse', src: null, alt: 'Gentle 60-second evening cleanse routine' },
    ],
    keyIngredients: [
      {
        name: 'Ceramide NP + Phytosphingosine',
        benefit: 'Replenishes skin barrier lipids so your face never feels tight or squeaky after rinsing.',
      },
      {
        name: '2% Colloidal Oat Extract',
        benefit: 'Cushions reactive skin and visibly calms dryness from hard tap water and AC air.',
      },
      {
        name: 'Panthenol (Pro-Vitamin B5)',
        benefit: 'Draws hydration into the surface layer while lifting daily sunscreen and dust.',
      },
    ],
    howToUse: [
      'Wet face with lukewarm water and massage 1–2 pumps in slow circles for 45–60 seconds.',
      'Rinse thoroughly and pat dry with a clean soft towel.',
      'Use morning and evening as step one of your daily ritual.',
    ],
    skinType: 'Formulated for dry, sensitized, combination, and acne-prone skin barriers. Sulfate-free and pH-balanced at 5.5.',
    shippingCodNote: 'Dispatched within 24 hours across Pakistan. Cash on Delivery available nationwide; free shipping on orders PKR 3,000+.',
    reviews: [
      {
        id: 'rev-cl-1',
        sample: true,
        author: 'Maha R.',
        city: 'Rawalpindi',
        rating: 5,
        date: '2026-10-10',
        text: 'Finally a cleanser that removes sunscreen without leaving my cheeks dry after washing.',
      },
      {
        id: 'rev-cl-2',
        sample: true,
        author: 'Sana T.',
        city: 'Lahore',
        rating: 5,
        date: '2026-10-21',
        text: 'Super gentle texture. My skin barrier calmed down within a week of switching to this.',
      },
      {
        id: 'rev-cl-3',
        sample: true,
        author: 'Noor A.',
        city: 'Multan',
        rating: 4,
        date: '2026-11-02',
        text: 'Clean formula, mild feel, and the 150ml bottle lasts almost two months.',
      },
    ],
  },
  {
    id: 'bb-niacinamide-toner',
    slug: 'niacinamide-rice-glow-toner',
    name: 'Niacinamide & Rice Glow Toner',
    category: 'Toners',
    tagline: 'Refines pores & balances hydration',
    extractionNote: 'Fermented Rice Water & 4% Niacinamide',
    price: 1650,
    sizeLabel: '120ml',
    variants: [
      { id: '120ml', label: '120ml', price: 1650 },
    ],
    rating: 4.9,
    reviewCount: 29,
    badges: ['New', 'Bestseller'],
    inStock: true,
    visualType: 'toner',
    accentTint: '#8FA391',
    images: [
      { id: 'front', label: 'Front Bottle', view: 'front', src: null, alt: 'Niacinamide & Rice Glow Toner frosted bottle' },
      { id: 'detail', label: 'Active Notes', view: 'detail', src: null, alt: 'Fermented rice and niacinamide label details' },
      { id: 'swatch', label: 'Milky Essence', view: 'swatch', src: null, alt: 'Silky rice-water toner droplet texture' },
      { id: 'in-use', label: 'Layering Guide', view: 'inUse', src: null, alt: 'Patting toner into damp skin step' },
    ],
    keyIngredients: [
      {
        name: '4% Niacinamide (Vitamin B3)',
        benefit: 'Balances excess T-zone shine and refines the appearance of enlarged pores.',
      },
      {
        name: 'Fermented Rice Filtrate',
        benefit: 'Delivers amino acids for soft, bouncy glass-skin hydration without heaviness.',
      },
      {
        name: 'Centella Asiatica & Glycerin',
        benefit: 'Soothes midday heat sensitivity and preps skin to absorb serums better.',
      },
    ],
    howToUse: [
      'Pour a few shakes into clean palms after cleansing (no cotton pad required).',
      'Press gently into skin until absorbed.',
      'Layer twice on days when skin feels dehydrated from sun or indoor cooling.',
    ],
    skinType: 'Ideal for combination, oily, dehydrated, and normal skin. Alcohol-free and essential-oil-free.',
    shippingCodNote: 'Dispatched within 24 hours across Pakistan. Cash on Delivery available nationwide; free shipping on orders PKR 3,000+.',
    reviews: [
      {
        id: 'rev-tn-1',
        sample: true,
        author: 'Eman F.',
        city: 'Karachi',
        rating: 5,
        date: '2026-10-18',
        text: 'Feels weightless in humid weather and keeps my T-zone balanced all afternoon.',
      },
      {
        id: 'rev-tn-2',
        sample: true,
        author: 'Fatima Z.',
        city: 'Faisalabad',
        rating: 5,
        date: '2026-10-30',
        text: 'Gives an instant soft glow without any stickiness. Love pressing it in with hands.',
      },
      {
        id: 'rev-tn-3',
        sample: true,
        author: 'Amna B.',
        city: 'Islamabad',
        rating: 5,
        date: '2026-11-08',
        text: 'Paired with the Vitamin C serum, my morning routine feels effortless now.',
      },
    ],
  },
  {
    id: 'bb-peptide-balm',
    slug: 'peptide-squalane-recovery-balm',
    name: 'Peptide & Squalane Recovery Balm',
    // Filed under "Serums" (targeted treatments) so the storefront's five category filters
    // (All, Serums, Cleansers, Toners, Bundles) cover every product cleanly.
    category: 'Serums',
    tagline: 'Deep overnight moisture for sensitive skin',
    extractionNote: 'Plant Squalane & Biomimetic Peptides',
    price: 2250,
    sizeLabel: '50g',
    variants: [
      { id: '50g', label: '50g', price: 2250 },
    ],
    rating: 4.8,
    reviewCount: 19,
    badges: ['New'],
    inStock: true,
    visualType: 'jar',
    accentTint: '#6C7F6E',
    images: [
      { id: 'front', label: 'Apothecary Jar', view: 'front', src: null, alt: 'Peptide & Squalane Recovery Balm jar' },
      { id: 'detail', label: 'Barrier Specs', view: 'detail', src: null, alt: 'Peptide and squalane concentration details' },
      { id: 'swatch', label: 'Whipped Balm', view: 'swatch', src: null, alt: 'Velvety balm cream texture swatch' },
      { id: 'in-use', label: 'Night Seal', view: 'inUse', src: null, alt: 'Overnight recovery application step' },
    ],
    keyIngredients: [
      {
        name: 'Sugarcane-Derived Squalane',
        benefit: 'Mimics skin’s natural sebum to lock in moisture overnight without clogging pores.',
      },
      {
        name: 'Tri-Peptide Complex',
        benefit: 'Supports skin bounce and helps smooth dry, wind-chapped patches.',
      },
      {
        name: 'Shea Ester & Bisabolol',
        benefit: 'Creates a breathable, comforting cocoon for irritated or over-exfoliated skin.',
      },
    ],
    howToUse: [
      'Take a pea-sized amount as the final step of your evening routine.',
      'Warm briefly between fingertips and press over face and neck.',
      'Can also be dabbed onto dry patches around nose or cheeks during winter.',
    ],
    skinType: 'Crafted for sensitive, dry, compromised, and winter-dehydrated skin. Non-greasy satin finish.',
    shippingCodNote: 'Dispatched within 24 hours across Pakistan. Cash on Delivery available nationwide; free shipping on orders PKR 3,000+.',
    reviews: [
      {
        id: 'rev-pb-1',
        sample: true,
        author: 'Sadia N.',
        city: 'Islamabad',
        rating: 5,
        date: '2026-10-22',
        text: 'My skin wakes up soft and plump without feeling heavy or sweaty on the pillow.',
      },
      {
        id: 'rev-pb-2',
        sample: true,
        author: 'Rida H.',
        city: 'Lahore',
        rating: 5,
        date: '2026-11-01',
        text: 'Rescued my skin after overusing actives. So calming and zero fragrance.',
      },
      {
        id: 'rev-pb-3',
        sample: true,
        author: 'Mariam W.',
        city: 'Peshawar',
        rating: 4,
        date: '2026-11-09',
        text: 'A tiny pea-sized scoop covers my whole face. Lovely matte-velvet finish.',
      },
    ],
  },
  {
    id: 'bb-ritual-bundle',
    slug: 'complete-daily-skin-ritual-set',
    name: 'Complete Daily Skin Ritual Set (3-Piece Bundle)',
    category: 'Bundles',
    tagline: 'Full cleanse, tone & brighten routine',
    extractionNote: '3-Step Clean Botanical Routine',
    price: 4450,
    sizeLabel: '3 Full-Size Steps',
    variants: [
      { id: '3-piece', label: '3-Piece Set', price: 4450 },
    ],
    bundleIncludesText:
      'Includes: Ceramide & Oat Barrier Cleanser, Niacinamide & Rice Glow Toner, Vitamin C + E Brightening Serum 30ml',
    bundleComponents: [
      { productId: 'bb-ceramide-cleanser', variantId: '150ml' },
      { productId: 'bb-niacinamide-toner', variantId: '120ml' },
      { productId: 'bb-vitc-serum', variantId: '30ml' },
    ],
    rating: 5.0,
    reviewCount: 24,
    badges: ['Bestseller'],
    inStock: true,
    visualType: 'bundle',
    accentTint: '#2D3830',
    images: [
      { id: 'front', label: '3-Piece Collection', view: 'front', src: null, alt: 'Complete Daily Skin Ritual Set 3-piece bundle' },
      { id: 'detail', label: 'Set Contents', view: 'detail', src: null, alt: 'Cleanser 150ml, Toner 120ml, and Serum 30ml breakdown' },
      { id: 'swatch', label: '3-Step Textures', view: 'swatch', src: null, alt: 'Gel cleanser, milky toner, and light serum layers' },
      { id: 'in-use', label: 'AM / PM Order', view: 'inUse', src: null, alt: 'Step 1 Cleanse, Step 2 Tone, Step 3 Brighten' },
    ],
    keyIngredients: [
      {
        name: 'Step 1 — Ceramide & Oat Cleanser (150ml)',
        benefit: 'Lifts impurities while protecting your natural lipid barrier.',
      },
      {
        name: 'Step 2 — Niacinamide & Rice Glow Toner (120ml)',
        benefit: 'Balances oil and hydrates skin with fermented rice amino acids.',
      },
      {
        name: 'Step 3 — Vitamin C + E Brightening Serum (30ml)',
        benefit: 'Brightens uneven tone and boosts everyday luminosity.',
      },
    ],
    howToUse: [
      'Cleanse gently with Ceramide & Oat Barrier Cleanser and pat skin damp.',
      'Press Niacinamide & Rice Glow Toner into face and neck.',
      'Seal in radiance with 3–4 drops of Vitamin C + E Brightening Serum.',
    ],
    skinType: 'Thoughtfully paired for all Pakistani skin types seeking a simple, reliable 3-minute daily ritual.',
    shippingCodNote: 'Qualifies automatically for FREE nationwide shipping across Pakistan with Cash on Delivery.',
    reviews: [
      {
        id: 'rev-bd-1',
        sample: true,
        author: 'Komal J.',
        city: 'Lahore',
        rating: 5,
        date: '2026-10-19',
        text: 'Takes the guesswork out of layering. Everything arrived neatly packed with free delivery.',
      },
      {
        id: 'rev-bd-2',
        sample: true,
        author: 'Areeba I.',
        city: 'Karachi',
        rating: 5,
        date: '2026-11-03',
        text: 'Bought this as a bridal trousseau gift for my sister and she loved every step.',
      },
      {
        id: 'rev-bd-3',
        sample: true,
        author: 'Mehwish Q.',
        city: 'Sialkot',
        rating: 5,
        date: '2026-11-11',
        text: 'Great value compared to buying separately, and my skin looks calmer and more even.',
      },
    ],
  },
];

export function getProductById(productId) {
  return PRODUCTS.find((p) => p.id === productId) || null;
}

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function getVariantOrDefault(product, variantId) {
  if (!product || !Array.isArray(product.variants) || product.variants.length === 0) {
    return null;
  }
  return product.variants.find((v) => v.id === variantId) || product.variants[0];
}

/**
 * Computes bundle savings dynamically from the component products' variant prices.
 * Never hardcodes savings so catalog price changes stay automatically accurate.
 */
export function getBundleSavings(product) {
  if (!product || !Array.isArray(product.bundleComponents) || product.bundleComponents.length === 0) {
    return 0;
  }
  const componentsTotal = product.bundleComponents.reduce((sum, ref) => {
    const comp = getProductById(ref.productId);
    const variant = getVariantOrDefault(comp, ref.variantId);
    return sum + (variant ? variant.price : 0);
  }, 0);
  return Math.max(0, componentsTotal - product.price);
}
