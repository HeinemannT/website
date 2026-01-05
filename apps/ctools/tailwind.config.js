/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"IBM Plex Sans"', 'sans-serif'],
                mono: ['"IBM Plex Mono"', 'monospace'],
            },
            colors: {
                // Core Carbon Tokens (Mapped to CSS Variables)
                background: 'var(--background)',
                'layer-01': 'var(--layer-01)',
                'layer-02': 'var(--layer-02)',
                'layer-03': 'var(--layer-03)',

                'text-primary': 'var(--text-primary)',
                'text-secondary': 'var(--text-secondary)',
                'text-disabled': 'var(--text-disabled)',
                'text-on-color': 'var(--text-on-color)',

                'border-subtle': 'var(--border-subtle)',
                'border-strong': 'var(--border-strong)',

                'interactive-01': 'var(--interactive-01)',
                'interactive-01-hover': 'var(--interactive-01-hover)',
                'focus': 'var(--focus)',

                // Legacy/Tool Identities (Updated to harmonized palette if needed, keeping for now)
                cora: { 500: 'var(--interactive-01)' }, // Redirect cora primary to new identity
                colorset: '#ec4899',
                layout: '#3b82f6',
                process: '#10b981',
                table: '#f97316',
                image: '#8b5cf6',
                tuner: '#14b8a6',
            },
            borderRadius: {
                // Carbon prefers 0 or 2px. We override standard utilities or add semantics.
                'none': '0',
                'sm': '2px',
                'DEFAULT': '4px', // Fallback
                'md': '4px',
                'lg': '8px',
            }
        },
    },
    plugins: [],
}
