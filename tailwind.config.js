// tailwind.config.js
/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');


function scaleValues(obj, factor) {
  const scaled = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'string') {
      // Match values like "1rem", "16px", "0.5em"
      const match = value.match(/^([\d.]+)(rem|px|em)$/);
      if (match) {
        const num = parseFloat(match[1]) * factor;
        scaled[key] = num + match[2];
        continue;
      }
    }
    // If non-scalar (nested object), recurse
    if (typeof value === 'object' && value !== null) {
      scaled[key] = scaleValues(value, factor);
      continue;
    }
    // Fallback: leave untouched
    scaled[key] = value;
  }
  return scaled;
}


module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    { pattern: /bg-\[var\(--.*\)\]/ },
    { pattern: /text-\[var\(--.*\)\]/ },
    { pattern: /border-\[var\(--.*\)\]\/.*/ },
  ],
  theme: {
    extend: {
      keyframes: {
        spinDots: {
          '0%, 100%': { boxShadow: '.2em 0 0 currentColor' },
          '12%': { boxShadow: '.2em .2em 0 currentColor' },
          '25%': { boxShadow: '0 .2em 0 currentColor' },
          '37%': { boxShadow: '-.2em .2em 0 currentColor' },
          '50%': { boxShadow: '-.2em 0 0 currentColor' },
          '62%': { boxShadow: '-.2em -.2em 0 currentColor' },
          '75%': { boxShadow: '0 -.2em 0 currentColor' },
          '87%': { boxShadow: '.2em -.2em 0 currentColor' },
        },
      },
      animation: {
        spinDots: 'spinDots 1s linear infinite',
      },
      spacing: scaleValues(defaultTheme.spacing, 0.8),
      fontSize: scaleValues(defaultTheme.fontSize, 0.8),
      borderRadius: scaleValues(defaultTheme.borderRadius, 0.8),
      maxWidth: scaleValues(defaultTheme.maxWidth, 0.8),
      minWidth: scaleValues(defaultTheme.minWidth, 0.8),
      minHeight: scaleValues(defaultTheme.minHeight, 0.8),
      maxHeight: scaleValues(defaultTheme.maxHeight, 0.8),
      lineHeight: scaleValues(defaultTheme.lineHeight, 0.8),
      letterSpacing: scaleValues(defaultTheme.letterSpacing, 0.8),
    },

  },
  plugins: [require('@tailwindcss/typography')],
};