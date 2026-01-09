<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    Code, 
    Layout as LayoutIcon, 
    Eye, 
    EyeOff, 
    PaintBucket, 
    RotateCcw
} from 'lucide-vue-next'
import ToolHeader from '@components/layout/ToolHeader.vue'
import ToolLayout from '@components/layout/ToolLayout.vue'
import { TOOLS } from '@config/tools'
import { useTemplateBuilder } from '../composables/useTemplateBuilder'

// Sub-components
import InventoryPanel from '../components/InventoryPanel.vue'
import PropertiesPanel from '../components/PropertiesPanel.vue'
import BuilderGrid from '../components/BuilderGrid.vue'
import CodeOutputPanel from '@components/ui/CodeOutputPanel.vue'

// Tool Metadata
const tool = TOOLS.find(t => t.id === 'template')!

// Theme Colors (Lifted from ToolLayout logic to apply globally including Header)
const toolThemeStyle = computed(() => {
    if (tool.themeColors) {
        return {
            '--interactive-01': tool.themeColors.primary,
            '--interactive-01-hover': tool.themeColors.hover,
            '--focus': tool.themeColors.primary 
        } as any
    }
    return {}
})

// UI State
const activeTab = ref<'layout' | 'script'>('layout')
const isPreview = ref(false)
const isPaintMode = ref(false)
const paintStyle = ref<{ bg: string, text: string } | null>(null)

const {
    scriptOutput,
    widgets,
    targetFolderVar
} = useTemplateBuilder()

// Actions
const confirmReset = () => {
    if (confirm('Are you sure you want to clear the layout?')) {
        const { widgets, rootPage } = useTemplateBuilder()
        rootPage.value = null
        widgets.value = []
    }
}

// Paint Logic
const togglePaintMode = () => {
    isPaintMode.value = !isPaintMode.value
    if (!isPaintMode.value) paintStyle.value = null
}

const handlePaint = (id: string) => {
    const item = widgets.value.find(i => i.id === id)
    if (!item) return
    
    if (!paintStyle.value) {
        // Pick
        paintStyle.value = { 
            bg: item.headerColor || '#ffffff', 
            text: item.headerTextColor || '#161616' 
        }
    } else {
        // Apply
        item.headerColor = paintStyle.value.bg
        item.headerTextColor = paintStyle.value.text
    }
}
</script>

<template>
    <div class="h-screen flex flex-col bg-layer-01 overflow-hidden" :style="toolThemeStyle">
        
        <!-- Header -->
        <ToolHeader title="Template Builder" :theme="tool.headerTheme">
             <template #subtitle>
                 <span class="ml-2 text-[10px] bg-layer-03 px-1.5 py-0.5 rounded text-text-secondary font-mono">BETA</span>
             </template>

             <template #center>
                 <!-- Fixed Width Container for Tabs to prevent jumping -->
                 <div class="flex items-center gap-4">
                     <div class="flex bg-layer-02 rounded p-1 gap-1 border border-border-subtle w-[180px] justify-center">
                         <button 
                             @click="activeTab = 'layout'"
                             class="flex-1 px-3 py-1 text-xs font-medium rounded-sm flex items-center justify-center gap-2 transition-all"
                             :class="activeTab === 'layout' ? 'bg-interactive-01 text-white shadow-sm' : 'text-text-primary hover:bg-layer-hover'"
                         >
                             <LayoutIcon class="w-3.5 h-3.5" /> Layout
                         </button>
                         <button 
                             @click="activeTab = 'script'"
                             class="flex-1 px-3 py-1 text-xs font-medium rounded-sm flex items-center justify-center gap-2 transition-all"
                             :class="activeTab === 'script' ? 'bg-interactive-01 text-white shadow-sm' : 'text-text-primary hover:bg-layer-hover'"
                         >
                             <Code class="w-3.5 h-3.5" /> Script
                         </button>
                     </div>
                     
                     <!-- Toggles (Fixed Width Reservation) -->
                     <div class="flex items-center gap-2 w-[220px]">
                         <!-- Preview Toggle -->
                         <button 
                            @click="isPreview = !isPreview"
                            class="flex-1 flex items-center justify-center gap-2 px-3 py-1 text-xs font-medium border rounded-sm transition-all"
                            :class="[
                                activeTab !== 'layout' ? 'opacity-0 pointer-events-none' : '',
                                isPreview ? 'bg-interactive-01 text-white border-transparent shadow-sm' : 'bg-white dark:bg-transparent text-text-primary border-border-strong hover:bg-layer-hover'
                            ]"
                         >
                            <component :is="isPreview ? Eye : EyeOff" class="w-3.5 h-3.5" />
                            Preview
                         </button>

                         <!-- Paint Tool Toggle -->
                         <button 
                            @click="togglePaintMode"
                            class="flex-1 flex items-center justify-center gap-2 px-3 py-1 text-xs font-medium border rounded-sm transition-all"
                            :class="[
                                activeTab !== 'layout' ? 'opacity-0 pointer-events-none' : '',
                                isPaintMode ? 'bg-interactive-01 text-white border-transparent shadow-sm' : 'bg-white dark:bg-transparent text-text-primary border-border-strong hover:bg-layer-hover'
                            ]"
                            title="Click to pick a style, then click items to apply."
                         >
                            <PaintBucket class="w-3.5 h-3.5" />
                            <span v-if="paintStyle">Apply</span>
                            <span v-else>Pick Style</span>
                         </button>
                     </div>
                 </div>
             </template>

             <template #actions>
                 <div class="flex items-center gap-2">
                     <button 
                        @click="confirmReset" 
                        class="px-3 py-1 bg-transparent text-text-error border border-transparent hover:bg-layer-hover rounded-sm transition-colors flex items-center gap-2 text-xs font-medium"
                        title="Reset Layout"
                    >
                        <RotateCcw class="w-3.5 h-3.5" />
                        Reset
                    </button>
                 </div>
             </template>
        </ToolHeader>

        <!-- Tool Layout Container -->
        <ToolLayout sidebar-position="left" sidebar-class="w-64">
            
            <template #sidebar>
                <InventoryPanel />
            </template>

            <template #main>
                <div class="flex h-full overflow-hidden">
                    
                    <!-- Center Canvas / Script -->
                    <div class="flex-1 overflow-hidden relative flex flex-col bg-layer-01">
                        <BuilderGrid 
                            v-if="activeTab === 'layout'"
                            :is-preview="isPreview"
                            :is-paint-mode="isPaintMode"
                            @paint="handlePaint"
                        />
                        <div v-else class="flex-1 flex flex-col h-full overflow-hidden">
                            <!-- Code Panel -->
                            <CodeOutputPanel 
                                :code="scriptOutput" 
                                language="corporater" 
                                class="flex-1"
                            >
                                <template #header-center>
                                    <div class="flex items-center gap-2">
                                        <span class="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">Target Folder:</span>
                                        <div class="relative flex items-center">
                                            <span class="absolute left-2 text-xs text-text-tertiary font-mono select-none">t.</span>
                                            <input 
                                                v-model="targetFolderVar"
                                                type="text"
                                                class="bg-layer-02 border border-border-subtle text-xs pl-5 pr-2 py-0.5 w-40 rounded-sm focus:border-interactive-01 focus:outline-none transition-colors font-mono text-text-primary h-6"
                                                placeholder="targetFolder"
                                            />
                                        </div>
                                    </div>
                                </template>
                            </CodeOutputPanel>
                        </div>
                    </div>

                    <!-- Right Sidebar (Local Implementation since ToolLayout is single-sidebar) -->
                    <aside 
                        v-if="activeTab === 'layout'"
                        class="w-72 border-l border-border-interactive bg-layer-01 flex flex-col z-10 shrink-0"
                    >
                        <PropertiesPanel />
                    </aside>

                </div>
            </template>

        </ToolLayout>
    </div>
</template>
