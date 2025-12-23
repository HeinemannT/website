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
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Semantic Primaries
                cora: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1', // Indigo (Suite)
                    600: '#4f46e5',
                },
                // Tool Identities (Aliased in tool-specific wrappers if needed, but here for global access)
                colorset: '#ec4899', // Pink
                layout: '#3b82f6',   // Blue
                process: '#10b981',  // Emerald
                table: '#f97316',    // Orange
                image: '#8b5cf6',    // Violet
                tuner: '#14b8a6',    // Teal (Svg Tuner)
            }
        },
    },
    plugins: [],
}
