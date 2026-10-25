/**
 * Resilient image fallback handlers & SVG data URL generators
 */

export function getFallbackImage(category = 'grocery') {
  // SVG vector illustration placeholders
  const colorMap = {
    grocery: { bg: '#edf6f0', text: '#184e36', label: 'Grocery' },
    fruits: { bg: '#fff7ed', text: '#c2410c', label: 'Fresh Produce' },
    dairy: { bg: '#eff6ff', text: '#1d4ed8', label: 'Dairy & Eggs' },
    bakery: { bg: '#fef3c7', text: '#b45309', label: 'Bakery' },
    snacks: { bg: '#faf5ff', text: '#7e22ce', label: 'Snacks' },
    beverages: { bg: '#ecfeff', text: '#0e7490', label: 'Beverages' },
    household: { bg: '#f1f5f9', text: '#475569', label: 'Household' },
    shop: { bg: '#f4f1eb', text: '#184e36', label: 'Local Store' }
  };

  const scheme = colorMap[category] || colorMap.grocery;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <rect width="100%" height="100%" fill="${scheme.bg}"/>
    <circle cx="200" cy="130" r="50" fill="${scheme.text}" opacity="0.1"/>
    <text x="50%" y="135" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="28" font-weight="700" fill="${scheme.text}">LocalKart</text>
    <text x="50%" y="180" dominant-baseline="middle" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="14" font-weight="500" fill="${scheme.text}" opacity="0.85">${scheme.label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleImageError(event, fallbackCategory = 'grocery') {
  event.target.onerror = null; // Prevent infinite loop
  event.target.src = getFallbackImage(fallbackCategory);
}
