export interface ThemeConfig {
    color: string           // Icon color class
    borderClass: string     // Hover border color class
    activeClass: string     // Active state class for sidebar
    headerTheme: string     // Colored header theme
    themeColors: {          // CSS variable overrides
        primary: string
        hover: string
    }
}

export const THEMES = {
    blue: {
        color: 'text-blue-600 dark:text-blue-400',
        borderClass: 'hover:border-blue-600 dark:hover:border-blue-400',
        activeClass: 'border-blue-600 text-blue-600 dark:text-blue-400 bg-layer-02',
        headerTheme: 'bg-blue-600 dark:bg-blue-600 text-white border-blue-700',
        themeColors: { primary: '#2563EB', hover: '#1D4ED8' }
    },
    teal: {
        color: 'text-teal-600 dark:text-teal-400',
        borderClass: 'hover:border-teal-600 dark:hover:border-teal-400',
        activeClass: 'border-teal-600 text-teal-600 dark:text-teal-400 bg-layer-02',
        headerTheme: 'bg-teal-600 dark:bg-teal-600 text-white border-teal-700',
        themeColors: { primary: '#0D9488', hover: '#0F766E' }
    },
    indigo: {
        color: 'text-indigo-600 dark:text-indigo-400',
        borderClass: 'hover:border-indigo-600 dark:hover:border-indigo-400',
        activeClass: 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-layer-02',
        headerTheme: 'bg-indigo-600 dark:bg-indigo-600 text-white border-indigo-700',
        themeColors: { primary: '#4F46E5', hover: '#4338CA' }
    },
    pink: {
        color: 'text-pink-600 dark:text-pink-400',
        borderClass: 'hover:border-pink-600 dark:hover:border-pink-400',
        activeClass: 'border-pink-600 text-pink-600 dark:text-pink-400 bg-layer-02',
        headerTheme: 'bg-pink-600 dark:bg-pink-600 text-white border-pink-700',
        themeColors: { primary: '#DB2777', hover: '#BE185D' }
    },
    orange: {
        color: 'text-orange-600 dark:text-orange-400',
        borderClass: 'hover:border-orange-600 dark:hover:border-orange-400',
        activeClass: 'border-orange-600 text-orange-600 dark:text-orange-400 bg-layer-02',
        headerTheme: 'bg-orange-600 dark:bg-orange-600 text-white border-orange-700',
        themeColors: { primary: '#EA580C', hover: '#C2410C' }
    },
    cyan: {
        color: 'text-cyan-600 dark:text-cyan-400',
        borderClass: 'hover:border-cyan-600 dark:hover:border-cyan-400',
        activeClass: 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-layer-02',
        headerTheme: 'bg-cyan-600 dark:bg-cyan-600 text-white border-cyan-700',
        themeColors: { primary: '#0891B2', hover: '#0E7490' }
    },
    red: {
        color: 'text-red-600 dark:text-red-400',
        borderClass: 'hover:border-red-600 dark:hover:border-red-400',
        activeClass: 'border-red-600 text-red-600 dark:text-red-400 bg-layer-02',
        headerTheme: 'bg-red-600 dark:bg-red-600 text-white border-red-700',
        themeColors: { primary: '#DC2626', hover: '#B91C1C' }
    },
    slate: {
        color: 'text-slate-600 dark:text-slate-400',
        borderClass: 'hover:border-slate-600 dark:hover:border-slate-400',
        activeClass: 'border-slate-600 text-slate-600 dark:text-slate-400 bg-layer-02',
        headerTheme: 'bg-slate-700 dark:bg-slate-800 text-white border-slate-900',
        themeColors: { primary: '#475569', hover: '#334155' }
    },
    emerald: {
        color: 'text-emerald-600 dark:text-emerald-400',
        borderClass: 'hover:border-emerald-600 dark:hover:border-emerald-400',
        activeClass: 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-layer-02',
        headerTheme: 'bg-emerald-600 dark:bg-emerald-600 text-white border-emerald-700',
        themeColors: { primary: '#059669', hover: '#047857' }
    }
} satisfies Record<string, ThemeConfig>
