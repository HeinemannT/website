import {
    Palette,
    LayoutTemplate,
    Activity,
    Table,
    Image as ImageIcon,
    Wand2,
    PenTool,
    LayoutDashboard
} from 'lucide-vue-next'

export interface ToolConfig {
    id: string
    name: string
    description?: string
    path: string
    icon: any
    color: string         // Text color class (e.g. 'text-indigo-600')
    bgColor?: string      // Background color class for dashboard (optional if not used in sidebar)
    sidebarColor?: string // Color for sidebar active state (usually same as color but maybe different lightness)
}

export const TOOLS: ToolConfig[] = [
    {
        id: 'dashboard',
        name: 'Dashboard',
        description: 'Central Hub',
        path: '/',
        icon: LayoutDashboard,
        color: 'text-slate-500',
        sidebarColor: 'text-slate-500'
    },
    {
        id: 'layout',
        name: 'Layout Builder',
        description: 'Design layouts with visual editor.',
        path: '/layout',
        icon: LayoutTemplate,
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        color: 'text-indigo-600 dark:text-indigo-400',
        sidebarColor: 'text-indigo-500'
    },
    {
        id: 'table',
        name: 'Table Builder',
        description: 'Configure Extended Table properties.',
        path: '/table',
        icon: Table,
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        color: 'text-emerald-600 dark:text-emerald-400',
        sidebarColor: 'text-emerald-500'
    },
    {
        id: 'colorset',
        name: 'Colorset Builder',
        description: 'Create, manage, and export palettes.',
        path: '/colorset',
        icon: Palette,
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        color: 'text-rose-600 dark:text-rose-400',
        sidebarColor: 'text-rose-500'
    },
    {
        id: 'image',
        name: 'Image Upload',
        description: 'Convert images to Base64 scripts.',
        path: '/image',
        icon: ImageIcon,
        bgColor: 'bg-violet-50 dark:bg-violet-900/20',
        color: 'text-violet-600 dark:text-violet-400',
        sidebarColor: 'text-violet-500'
    },
    {
        id: 'tuner',
        name: 'SVG Tuner',
        description: 'Clean and optimize SVG files.',
        path: '/tuner',
        icon: Wand2,
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        color: 'text-amber-600 dark:text-amber-400',
        sidebarColor: 'text-amber-500'
    },
    {
        id: 'process',
        name: 'Process Tool',
        description: 'BPMN modeling with specific extensions.',
        path: '/process',
        icon: Activity,
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        color: 'text-blue-600 dark:text-blue-400',
        sidebarColor: 'text-blue-500'
    },
    {
        id: 'cdraw',
        name: 'cDraw',
        description: 'Diagramming and GRC modeling tool.',
        path: '/cdraw',
        icon: PenTool,
        bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
        color: 'text-cyan-600 dark:text-cyan-400',
        sidebarColor: 'text-cyan-500'
    }
]

// Helper to exclude dashboard from the tools list (for dashboard grid)
export const DASHBOARD_TOOLS = TOOLS.filter(t => t.id !== 'dashboard')
