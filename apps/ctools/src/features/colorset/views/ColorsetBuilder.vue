<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { Plus, Trash2, ExternalLink, ArrowRight, Folder, Palette, Layers, BarChart3 } from 'lucide-vue-next'
import BaseButton from '@components/ui/BaseButton.vue'
import BaseInput from '@components/ui/BaseInput.vue'
import StrategyCard from '../components/StrategyCard.vue'
import ToolLayout from '@components/layout/ToolLayout.vue'
import ToolHeader from '@components/layout/ToolHeader.vue'
import ToolSidebar from '@components/layout/ToolSidebar.vue'
import { useColorset } from '../composables/useColorset'
import { TOOLS } from '@config/tools'

// Async Components for Performance
const CodeOutputPanel = defineAsyncComponent(() => import('@components/ui/CodeOutputPanel.vue'))
const ColorMatrix = defineAsyncComponent(() => import('../components/ColorMatrix.vue'))

const tool = TOOLS.find(t => t.id === 'colorset')!

// --- Composable ---
const {
    // State
    rootParentId,
    setName,
    setId,
    palette,
    selectedIndex,
    // Editor
    currentHex,
    currentHue,
    currentSat,
    currentVal,
    currentRgb,
    // Generator
    genStrategy,
    genColors,
    harmonyType,
    datavizCount,
    scaleSteps,
    interStart,
    interEnd,
    interSteps,
    importContent,
    
    // Methods
    updateColorFromHex,
    updateColorFromHsv,
    updateColorFromRgb,
    updateModel,
    addColor: _addColor,
    deleteColor,
    generatePreview: _generatePreview,
    commitGenerated: _commitGenerated,
    processPaste: _processPaste,

    // Computed
    scriptOutput
} = useColorset()

// --- UI State ---
const activeTab = ref<'studio' | 'generate' | 'import' | 'extended'>('studio')

const sidebarTabs = [
    { id: 'studio', label: 'Studio' },
    { id: 'generate', label: 'Generate' },
    { id: 'import', label: 'Import' },
    { id: 'extended', label: 'Extended Code' }
]

// --- Wrapped Actions (Tab Management) ---
const addColor = () => {
    const tab = _addColor()
    if (tab) activeTab.value = tab as any
}

const commitGenerated = () => {
    const tab = _commitGenerated()
    if (tab) activeTab.value = tab as any
}

const processPaste = () => {
    const tab = _processPaste()
    if (tab) activeTab.value = tab as any
}

const generatePreview = () => {
    _generatePreview(activeTab.value)
}

// --- Canvas Logic ---
const hueContainer = ref<HTMLDivElement | null>(null)
const isHueDragging = ref(false)

const handleMatrixUpdate = (s: number, v: number) => {
    currentSat.value = s
    currentVal.value = v
    updateColorFromHsv()
}

const updateHueFromMouse = (e: MouseEvent) => {
    if (!hueContainer.value) return
    const rect = hueContainer.value.getBoundingClientRect()
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    currentHue.value = (y / rect.height) * 360
    updateColorFromHsv() 
}

// Lifecycle Hooks for Canvas
onMounted(() => {
    window.addEventListener('mousemove', (e) => {
        if (isHueDragging.value) updateHueFromMouse(e)
    })
    window.addEventListener('mouseup', () => {
        isHueDragging.value = false
    })
})

</script>

<template>
    <ToolLayout sidebar-class="w-full md:w-1/3 border-l border-border-subtle bg-layer-01 shadow-xl z-20">

        
        <!-- Main: Palette Grid -->
        <template #main>
            <div class="h-full flex flex-col overflow-hidden font-sans bg-layer-01 bg-pattern-dots">
            <!-- Tool Header -->
            <ToolHeader title="Colorset Builder" :theme="tool.headerTheme">
                <template #center>
                        <div class="flex items-center gap-4 w-full max-w-xl px-4">
                        <div class="flex-1 flex items-center h-8">
                             <input v-model="setName" class="w-full bg-transparent border-b border-transparent hover:border-white/50 focus:border-white font-bold text-white text-sm h-full transition-colors outline-none placeholder-white/50 text-center md:text-left" placeholder="Palette Name" />
                        </div>
                        <div class="flex items-center gap-2 shrink-0 border-l border-white/20 pl-4 h-8">
                             <span class="text-[10px] font-bold text-white/80 uppercase tracking-wider pt-0.5">ID</span>
                             <div class="relative h-full flex items-center">
                                 <span class="text-xs text-white/60 font-mono hidden md:block mr-0.5">#</span>
                                 <input v-model="setId" class="w-24 bg-transparent border-b border-dashed border-white/30 hover:border-white focus:border-white focus:border-solid outline-none text-xs font-mono font-medium text-white h-full transition-colors placeholder-white/50" placeholder="auto" />
                             </div>
                        </div>
                    </div>
                </template>

                <template #actions>
                    <button @click="addColor" class="flex items-center gap-2 bg-black/20 text-white px-4 py-2 rounded-none hover:bg-black/30 transition-all font-bold text-xs shadow-none">
                        <Plus class="w-4 h-4" /> <span class="hidden sm:inline">New Color</span>
                    </button>
                </template>
            </ToolHeader>

            <!-- Grid -->
            <div class="flex-1 overflow-y-auto p-6">
                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="(col, idx) in palette" :key="idx" 
                         @click="selectedIndex = idx"
                         :class="{'ring-2 ring-focus border-transparent': selectedIndex === idx, 'hover:border-interactive-01': selectedIndex !== idx}"
                         class="bg-layer-01 rounded-none p-3 border border-border-subtle cursor-pointer transition-all duration-100 group relative shadow-none">
                        
                        <div :style="{ backgroundColor: col.hex }" class="h-20 shadow-none mb-3 relative overflow-hidden border border-border-subtle">
                             <button @click.stop="deleteColor(idx)" class="absolute top-1 right-1 bg-black/50 text-white p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"><Trash2 class="w-3 h-3" /></button>
                        </div>
                        
                        <input v-model="col.name" @click.stop class="w-full bg-transparent text-xs font-bold mb-1 border-none p-0 focus:ring-0 text-text-primary" />
                        <span class="block text-[10px] font-mono text-text-secondary uppercase">{{ col.hex }}</span>
                    </div>
                </div>
            </div>
            </div>
        </template>

        <!-- Sidebar: Studio -->
        <template #sidebar>
            <ToolSidebar :tabs="sidebarTabs" v-model:activeTab="activeTab">
                <div class="h-full flex flex-col" :class="activeTab === 'extended' ? '' : 'p-6'">
                
                <!-- STUDIO -->
                <div v-if="activeTab === 'studio'" class="h-full flex flex-col">
                    <div v-if="selectedIndex === -1" class="flex-1 flex flex-col items-center justify-center text-text-secondary">
                        <Palette class="w-12 h-12 mb-4 opacity-50" />
                        <p class="text-xs uppercase font-bold tracking-widest">Select a color to edit</p>
                    </div>
                    
                    <div v-else class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <!-- Photoshop Style Picker -->
                        <div class="flex gap-4 h-64 mb-6 select-none">
                            <!-- Sat/Val Matrix -->
                            <ColorMatrix 
                                :hue="currentHue" 
                                :saturation="currentSat" 
                                :value="currentVal" 
                                :hex="currentHex"
                                @update="handleMatrixUpdate"
                            />

                            <!-- Hue Strip -->
                            <div class="w-8 relative rounded-none border border-border-strong overflow-hidden cursor-ns-resize"
                                 ref="hueContainer"
                                 @mousedown="isHueDragging = true; $event.preventDefault(); updateHueFromMouse($event)"
                                 style="background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)">
                                 <!-- Thumb -->
                                 <div class="absolute left-0 right-0 h-1.5 bg-layer-01 border border-border-strong rounded-none shadow-none pointer-events-none -translate-y-1/2"
                                      :style="{ top: `${(currentHue / 360) * 100}%` }"></div>
                            </div>
                        </div>

                        <!-- Saturation Slider -->
                        <div class="space-y-2 mb-6">
                            <div class="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                <span>Saturation ({{ Math.round(currentSat) }}%)</span>
                            </div>
                            <input type="range" v-model.number="currentSat" min="0" max="100" @input="updateColorFromHsv" class="w-full h-1 bg-layer-03 rounded-lg appearance-none cursor-pointer accent-interactive-01" />
                        </div>

                        <!-- Brightness Slider -->
                        <div class="space-y-2 mb-6">
                            <div class="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                <span>Brightness ({{ Math.round(currentVal) }}%)</span>
                            </div>
                            <input type="range" v-model.number="currentVal" min="0" max="100" @input="updateColorFromHsv" class="w-full h-1 bg-layer-03 rounded-lg appearance-none cursor-pointer accent-interactive-01" />
                        </div>

                        <!-- Data Inputs & Preview -->
                        <div class="flex gap-4">
                            <div class="w-20 h-20 shadow-none border border-border-subtle shrink-0" 
                                 :style="{backgroundColor: currentHex}"></div>
                            
                            <div class="flex-1 space-y-4">
                                <div class="flex items-center gap-2">
                                    <!-- Removed # prefix span -->
                                    <input v-model="currentHex" @input="(e) => updateColorFromHex((e.target as HTMLInputElement).value)" class="text-3xl font-mono font-medium bg-transparent border-b border-border-strong w-full focus:outline-none focus:border-interactive-01 uppercase text-text-primary" maxlength="7" />
                                </div>
                                <div class="flex gap-2 text-xs font-mono">
                                    <div class="flex-1 bg-layer-02 px-2 py-1 border-b border-border-strong">
                                        <label class="block text-[10px] font-bold text-text-secondary">R</label>
                                        <input v-model.number="currentRgb.r" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0 text-text-primary" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-layer-02 px-2 py-1 border-b border-border-strong">
                                        <label class="block text-[10px] font-bold text-text-secondary">G</label>
                                        <input v-model.number="currentRgb.g" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0 text-text-primary" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-layer-02 px-2 py-1 border-b border-border-strong">
                                        <label class="block text-[10px] font-bold text-text-secondary">B</label>
                                        <input v-model.number="currentRgb.b" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0 text-text-primary" type="number" min="0" max="255"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-border-subtle">
                            <label class="text-[10px] uppercase font-bold text-text-secondary block mb-2">Metadata</label>
                            <BaseInput v-if="palette[selectedIndex]" label="Name" v-model="palette[selectedIndex]!.name" @change="updateModel" class="mb-3" />
                            <BaseInput v-if="palette[selectedIndex]" label="ID" v-model="palette[selectedIndex]!.id" mono />
                        </div>
                    </div>
                </div>

                <!-- GENERATE STUDIO -->
                <div v-if="activeTab === 'generate'" class="h-full flex flex-col">
                    <div class="flex-1 overflow-y-auto space-y-6">
                        
                        <!-- Strategy Selection -->
                        <div class="space-y-3">
                            <label class="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Strategy</label>
                            <div class="grid grid-cols-2 gap-3">
                                <StrategyCard 
                                    title="Tailwind Scale" 
                                    description="11 steps (50-950)" 
                                    :modelValue="genStrategy === 'scale'"
                                    @select="genStrategy = 'scale'; generatePreview()"
                                    :icon="Layers"
                                />
                                <StrategyCard 
                                    title="Harmonies" 
                                    description="Comp, Triadic, etc." 
                                    :modelValue="genStrategy === 'harmony'"
                                    @select="genStrategy = 'harmony'; generatePreview()"
                                    :icon="Palette"
                                />
                                <StrategyCard 
                                    title="Data Viz" 
                                    description="Distinct Hues" 
                                    :modelValue="genStrategy === 'dataviz'"
                                    @select="genStrategy = 'dataviz'; generatePreview()"
                                    :icon="BarChart3"
                                />
                                <StrategyCard 
                                    title="Interpolate" 
                                    description="Mix two colors" 
                                    :modelValue="genStrategy === 'interpolate'"
                                    @select="genStrategy = 'interpolate'; generatePreview()"
                                    :icon="ArrowRight"
                                />
                            </div>
                        </div>

                        <!-- Controls -->
                        <div v-if="selectedIndex !== -1 || genStrategy === 'interpolate'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
                             
                            <!-- Base Color Info -->
                            <div v-if="genStrategy !== 'interpolate'" class="p-3 mb-4 bg-layer-02 flex items-center gap-3 border border-border-subtle">
                                <div class="w-10 h-10 shadow-none border border-border-subtle" :style="{backgroundColor: palette[selectedIndex]?.hex}"></div>
                                <div>
                                    <span class="text-[10px] uppercase font-bold text-text-secondary">Base Seed</span>
                                    <div class="text-xs font-bold text-text-primary">{{ palette[selectedIndex]?.name }}</div>
                                </div>
                            </div>
                            
                            <!-- Harmony Controls -->
                             <div v-if="genStrategy === 'harmony'" class="space-y-4 mb-4">
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="t in ['complementary', 'analogous', 'triadic', 'split', 'tetradic']" :key="t"
                                        @click="harmonyType = t as any; generatePreview()"
                                        :class="harmonyType === t ? 'bg-interactive-01 text-white' : 'bg-layer-02 text-text-secondary hover:text-text-primary'"
                                        class="px-2 py-1 text-[10px] uppercase font-bold text-center border border-border-subtle hover:border-border-strong transition-all rounded-none"
                                    >
                                        {{ t }}
                                    </button>
                                </div>
                             </div>

                             <!-- Data Viz Controls -->
                             <div v-if="genStrategy === 'dataviz'" class="space-y-2 mb-4">
                                <div class="flex justify-between text-[10px] font-bold text-text-secondary">
                                    <span>Count</span> <span>{{ datavizCount }}</span>
                                </div>
                                <input type="range" v-model.number="datavizCount" min="3" max="20" @input="generatePreview" class="w-full accent-interactive-01" />
                             </div>

                             <!-- Scale Controls (New) -->
                             <div v-if="genStrategy === 'scale'" class="space-y-2 mb-4">
                                <div class="flex justify-between text-[10px] font-bold text-text-secondary">
                                    <span>Steps</span> <span>{{ scaleSteps }}</span>
                                </div>
                                <input type="range" v-model.number="scaleSteps" min="3" max="21" step="1" @input="generatePreview" class="w-full accent-interactive-01 h-1 bg-layer-03 rounded-lg appearance-none cursor-pointer" />
                             </div>

                             <!-- Interpolate Controls -->
                             <div v-if="genStrategy === 'interpolate'" class="p-4 bg-layer-02 border border-border-subtle space-y-4 mb-4">
                                <div class="flex items-center gap-4">
                                    <!-- Start color syncs with selection but can be overridden -->
                                    <input type="color" v-model="interStart" @input="generatePreview" class="h-8 w-8 cursor-pointer border-none p-0" title="Start Color (from selection)" />
                                    <ArrowRight class="w-4 h-4 text-text-secondary" />
                                    <input type="color" v-model="interEnd" @input="generatePreview" class="h-8 w-8 cursor-pointer border-none p-0" title="End Color" />
                                </div>
                                <div>
                                    <div class="flex justify-between text-[10px] font-bold text-text-secondary mb-1">
                                        <span>Steps</span> <span>{{ interSteps }}</span>
                                    </div>
                                    <input type="range" v-model.number="interSteps" min="3" max="15" @input="generatePreview" class="w-full accent-interactive-01 h-1 bg-layer-03 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>

                            <!-- Preview List -->
                            <div class="space-y-2">
                                <div class="flex justify-between items-center text-[10px] font-bold text-text-secondary uppercase">
                                    <span>Preview Output</span>
                                    <span>{{ genColors.length }} Colors</span>
                                </div>
                                
                                <!-- Visual Scale Preview for Tailwind/Interpolate -->
                                <div v-if="genStrategy === 'scale' || genStrategy === 'interpolate'" class="flex h-8 w-full border border-border-subtle mb-2">
                                    <div v-for="g in genColors" :key="g.hex" class="flex-1 h-full" :style="{backgroundColor: g.hex}" :title="g.name"></div>
                                </div>

                                <div class="grid gap-2" :class="(genStrategy === 'scale' || genStrategy === 'dataviz' || genStrategy === 'interpolate') ? 'grid-cols-2' : 'grid-cols-1'">
                                    <div v-for="(g, i) in genColors" :key="i" class="flex items-center gap-2 p-1.5 bg-layer-02 rounded-none border border-border-subtle group hover:border-interactive-01 transition-colors">
                                        <div class="w-6 h-6 rounded-none shadow-none shrink-0" :style="{backgroundColor: g.hex}"></div>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-[10px] font-bold truncate text-text-primary">{{ g.name }}</div>
                                            <div class="text-[9px] font-mono text-text-secondary">{{ g.hex }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Empty State -->
                        <div v-else class="text-center py-12 px-4 border-2 border-dashed border-border-subtle opacity-50">
                             <Palette class="w-8 h-8 text-text-secondary mx-auto mb-2" />
                             <p class="text-xs text-text-secondary">Select a color from the grid to unlock generators</p>
                        </div>
                    </div>
                    
                    <!-- Fixed Bottom Action -->
                    <div class="p-4 border-t border-border-subtle bg-layer-01" v-if="genColors.length > 0">
                        <BaseButton class="w-full" @click="commitGenerated">
                            <Plus class="w-4 h-4 mr-2" /> Add {{ genColors.length }} Colors to Palette
                        </BaseButton>
                    </div>
                </div>

                <!-- IMPORT -->
                <div v-if="activeTab === 'import'" class="space-y-6">
                    <p class="text-xs text-text-secondary">Paste text containing hex codes (e.g. from Coolors, Figma, CSS).</p>
                    <textarea v-model="importContent" class="w-full h-48 bg-layer-02 border border-border-strong rounded-none p-4 font-mono text-xs focus:ring-1 focus:ring-interactive-01 outline-none resize-none text-text-primary" placeholder="#FF0000&#10;#00FF00&#10;..."></textarea>
                    <BaseButton class="w-full" @click="processPaste">Import Found Colors</BaseButton>
                    
                    <div class="pt-6 border-t border-border-subtle space-y-3">
                        <label class="text-[10px] uppercase font-bold text-text-secondary">External Tools</label>
                        <div class="grid grid-cols-1 gap-2">
                             <a href="https://coolors.co/" target="_blank" class="flex justify-between items-center p-3 bg-layer-02 rounded-none border border-border-subtle hover:border-interactive-01 transition-colors text-xs font-bold text-text-primary">
                                  Coolors.co <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://color.adobe.com/create/color-wheel" target="_blank" class="flex justify-between items-center p-3 bg-layer-02 rounded-none border border-border-subtle hover:border-interactive-01 transition-colors text-xs font-bold text-text-primary">
                                  Adobe Color <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://colorhunt.co/" target="_blank" class="flex justify-between items-center p-3 bg-layer-02 rounded-none border border-border-subtle hover:border-interactive-01 transition-colors text-xs font-bold text-text-primary">
                                  Color Hunt <ExternalLink class="w-3 h-3" />
                             </a>
                        </div>
                    </div>
                </div>

                <!-- EXTENDED TAB -->
                <div v-if="activeTab === 'extended'" class="h-full flex flex-col">
                     <CodeOutputPanel title="Extended Code" :code="scriptOutput">
                         <template #actions>
                             <div class="w-48 pl-4 border-l border-border-subtle">
                                 <div class="flex flex-col gap-1">
                                     <label class="text-[9px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                                         <Folder class="w-3 h-3" /> Target Folder
                                     </label>
                                     <input v-model="rootParentId" placeholder="t.dashboards" class="w-full text-xs font-mono border-b border-border-strong bg-transparent focus:border-interactive-01 outline-none pb-1 placeholder-text-secondary text-text-primary" />
                                 </div>
                             </div>
                         </template>
                     </CodeOutputPanel>
                </div>
                </div> 
            </ToolSidebar>
        </template>
    </ToolLayout>
</template>
