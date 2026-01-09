import {
    IconLayout,
    IconTable,
    IconColor,
    IconImage,
    IconSvg,
    IconProcess,
    IconCDraw,
    IconSecurity,
    IconWip
} from '../components/icons'
import { THEMES, type ThemeConfig } from './themes'

export type ToolCategory = 'Configuration Accelerators' | 'System Builders' | 'Various'

export interface ToolDefinition {
    id: string
    name: string
    description: string
    path: string
    icon: any
    category: ToolCategory
    theme: keyof typeof THEMES
}

// The consumed configuration is the definition + the resolved theme props
export type ToolConfig = ToolDefinition & ThemeConfig

const REGISTRY: ToolDefinition[] = [
    // Configuration Accelerators
    {
        id: 'layout',
        name: 'Layout Builder',
        description: 'Design layouts with visual editor.',
        path: '/layout',
        icon: IconLayout,
        category: 'Configuration Accelerators',
        theme: 'blue'
    },
    {
        id: 'table',
        name: 'Table Builder',
        description: 'Configure Extended Table properties.',
        path: '/table',
        icon: IconTable,
        category: 'Configuration Accelerators',
        theme: 'teal'
    },
    {
        id: 'colorset',
        name: 'Colorset Builder',
        description: 'Create, manage, and export palettes.',
        path: '/colorset',
        icon: IconColor,
        category: 'Configuration Accelerators',
        theme: 'indigo'
    },

    // Various
    {
        id: 'image',
        name: 'Image Upload',
        description: 'Convert images to Base64 scripts.',
        path: '/image',
        icon: IconImage,
        category: 'Various',
        theme: 'pink'
    },
    {
        id: 'tuner',
        name: 'SVG Tuner',
        description: 'Clean and optimize SVG files.',
        path: '/tuner',
        icon: IconSvg,
        category: 'Various',
        theme: 'indigo'
    },

    // System Builders
    {
        id: 'process',
        name: 'Process Tool',
        description: 'BPMN modeling with specific extensions.',
        path: '/process',
        icon: IconProcess,
        category: 'System Builders',
        theme: 'cyan'
    },
    {
        id: 'cdraw',
        name: 'cDraw',
        description: 'Diagramming and GRC modeling tool.',
        path: '/cdraw',
        icon: IconCDraw,
        category: 'System Builders',
        theme: 'red'
    },
    {
        id: 'pbac',
        name: 'PBAC Architect',
        description: 'Model access policies and permissions.',
        path: '/pbac',
        icon: IconSecurity,
        category: 'System Builders',
        theme: 'emerald'
    },
    {
        id: 'template',
        name: 'WIP Template Builder',
        description: 'Experimental layout builder.',
        path: '/template',
        icon: IconWip,
        category: 'System Builders',
        theme: 'slate'
    }
]

// Export the hydrated config
export const TOOLS: ToolConfig[] = REGISTRY.map(tool => ({
    ...tool,
    ...THEMES[tool.theme]
}))

// Helper to exclude dashboard from the tools list (for dashboard grid)
export const DASHBOARD_TOOLS = TOOLS.filter(t => t.id !== 'dashboard' && t.id !== 'template')
