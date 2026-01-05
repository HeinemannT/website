<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Trash2, ExternalLink, ArrowRight, Folder, Palette, Layers, BarChart3 } from 'lucide-vue-next'
import tinycolor from 'tinycolor2'
import { ScriptBuilder } from '../utils/ScriptBuilder'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ColorMatrix from '../components/colors/ColorMatrix.vue'
import StrategyCard from '../components/colors/StrategyCard.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
import ToolHeader from '../components/layout/ToolHeader.vue'
import { 
    generateInterpolate, 
    generateHarmonies, 
    generateTailwindScale, 
    generateDataViz 
} from '../utils/ColorGenerators'
import { useToast } from '../composables/useToast'
import { usePersistentState } from '../composables/usePersistentState'
import { extractColors } from '../utils/ColorExtractor'

const { add: toast } = useToast()

// --- Types ---
interface ColorStart {
    id: string
    name: string
    hex: string
}

interface GeneratorOutput {
    name: string
    hex: string
}

// --- State ---
const rootParentId = usePersistentState('colorset:rootParentId', 't.color_folder')
const setName = usePersistentState('colorset:setName', 'New Palette')
const setId = usePersistentState('colorset:setId', '')

const palette = usePersistentState<ColorStart[]>('colorset:palette', [
    { id: '', name: 'Red', hex: '#EF4444' },
    { id: '', name: 'Yellow', hex: '#EAB308' },
    { id: '', name: 'Green', hex: '#22C55E' }
])

const activeTab = ref<'studio' | 'generate' | 'import' | 'extended'>('studio')
const selectedIndex = ref(-1)

// Editor State
const currentHex = ref('#EF4444')
const currentHue = ref(0)
const currentSat = ref(100)
const currentVal = ref(100)

const currentRgb = ref({ r: 239, g: 68, b: 68 })

// UI Refs (Canvas Logic moved to ColorMatrix)
const hueContainer = ref<HTMLDivElement | null>(null)
const isHueDragging = ref(false)

// Generator State
const genStrategy = ref<'scale' | 'harmony' | 'dataviz' | 'interpolate'>('scale')
const genColors = ref<GeneratorOutput[]>([])

// Generator Settings
// Generator Settings
const harmonyType = ref<'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic'>('complementary')
const datavizCount = ref(6)
const scaleSteps = ref(11)

// Interpolate State
const interStart = ref('#EF4444')
const interEnd = ref('#3B82F6')
const interSteps = ref(5)

// --- Watchers & Sync ---
watch(selectedIndex, (newIdx) => {
    if (newIdx !== -1) {
        const col = palette.value[newIdx]
        if (col) {
            setColorState(col.hex)
            
            // Sync interpolate start if reasonable
            interStart.value = col.hex
            
            generatePreview()
        }
    }
})

const setColorState = (hex: string) => {
    currentHex.value = hex
    const color = tinycolor(hex)
    const hsv = color.toHsv()
    currentHue.value = hsv.h
    currentSat.value = hsv.s * 100
    currentVal.value = hsv.v * 100
    const rgb = color.toRgb()
    currentRgb.value = { r: rgb.r, g: rgb.g, b: rgb.b }
}

const updateColorFromHex = (val: string) => {
    if (val.length === 7) {
        setColorState(val)
        updateModel()
    }
}

const updateColorFromHsv = () => {
    const color = tinycolor({ h: currentHue.value, s: currentSat.value / 100, v: currentVal.value / 100 })
    const hex = color.toHexString().toUpperCase()
    currentHex.value = hex
    const rgb = color.toRgb()
    currentRgb.value = { r: rgb.r, g: rgb.g, b: rgb.b }
    updateModel()
}

const updateColorFromRgb = () => {
    const color = tinycolor({ r: currentRgb.value.r, g: currentRgb.value.g, b: currentRgb.value.b })
    const hex = color.toHexString().toUpperCase()
    currentHex.value = hex
    const hsv = color.toHsv()
    currentHue.value = hsv.h
    currentSat.value = hsv.s * 100
    currentVal.value = hsv.v * 100
    updateModel()
}

// --- Canvas Logic ---
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
    updateColorFromHsv() // Triggers drawMatrix via watcher or direct
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

// Update canvas when color changes


const updateModel = () => {
    if (selectedIndex.value === -1) return
    const col = palette.value[selectedIndex.value]
    if (!col) return
    
    // Auto-rename if name looks like a previous hex
    if (col.name.startsWith('#') || col.name === col.hex) {
        col.name = currentHex.value
    }
    
    // Auto-update ID to match hex for consistency
    const safeHex = currentHex.value.replace('#', '')
    col.id = `color_${safeHex}`

    col.hex = currentHex.value
    generatePreview()
}

const addColor = () => {
    const newHex = '#64748B'
    palette.value.push({
        id: '',
        name: 'Color Name',
        hex: newHex
    })
    selectedIndex.value = palette.value.length - 1
    activeTab.value = 'studio'
}

const deleteColor = (idx: number) => {
    palette.value.splice(idx, 1)
    if (selectedIndex.value === idx) selectedIndex.value = -1
    else if (selectedIndex.value > idx) selectedIndex.value--
}

// --- Generator ---
const generatePreview = () => {
    if (activeTab.value !== 'generate') return // Optimization: Don't calculate if not visible

    genColors.value = []
    
    // Interpolate doesn't need selection (necessarily, though could use it)
    if (genStrategy.value === 'interpolate') {
        genColors.value = generateInterpolate(interStart.value, interEnd.value, interSteps.value)
        return
    }

    const selectedColor = palette.value[selectedIndex.value]
    if (selectedIndex.value === -1 || !selectedColor) return
    const base = selectedColor.hex

    if (genStrategy.value === 'scale') {
        genColors.value = generateTailwindScale(base, scaleSteps.value)
    } else if (genStrategy.value === 'harmony') {
        genColors.value = generateHarmonies(base, harmonyType.value)
    } else if (genStrategy.value === 'dataviz') {
        genColors.value = generateDataViz(base, datavizCount.value)
    }
}

const commitGenerated = () => {
    genColors.value.forEach(g => {
        palette.value.push({
            id: 'color_' + g.hex.replace('#', '').toLowerCase(),
            name: g.name,
            hex: g.hex
        })
    })
    toast(`Added ${genColors.value.length} generated colors`, 'success')
    activeTab.value = 'studio'
}

// --- Script Generation ---
const scriptOutput = computed(() => {
    const sb = new ScriptBuilder(`Set: ${setName.value}`)
    
    // 1. Define parent/target folder variable
    // Ensure parent starts with t. if it's not simply 't'
    let parentRef = rootParentId.value || 't'
    if (parentRef !== 't' && !parentRef.startsWith('t.')) {
        parentRef = 't.' + parentRef
    }
    sb.assign('targetFolder', parentRef)
    sb.addNewLine()

    // 2. Create the colorset object (Category -> CorpoColorSet)
    // ID is just a string now, no t. prefix
    const finalSetId = setId.value || ''
    
    // vSet := targetFolder.add(CorpoColorSet, ...)
    sb.assignAdd('vSet', 'targetFolder', 'CorpoColorSet', { 
        id: finalSetId, 
        name: setName.value 
    })
    sb.addNewLine()
    
    // 3. Add colors to the set (Color -> CorpoColor)
    palette.value.forEach(col => {
        sb.createObject('vSet', 'CorpoColor', { 
            id: col.id, 
            name: col.name, 
            color: col.hex 
        })
    })
    return sb.toString()
})

// --- Import ---
const importContent = ref('')
const processPaste = () => {
    const extracted = extractColors(importContent.value)
    
    let count = 0
    extracted.forEach(c => {
        palette.value.push({
            id: 'color_' + c.hex.replace('#', '').toLowerCase(),
            name: c.name, // Will use 'Red', '#FF0000', or 'rgb(..)' as name
            hex: c.hex
        })
        count++
    })

    if (count > 0) {
        toast(`Imported ${count} colors`, 'success')
        importContent.value = ''
        activeTab.value = 'studio'
    } else {
        toast('No valid colors found', 'error')
    }
}

import { TOOLS } from '../config/tools'
const tool = TOOLS.find(t => t.id === 'colorset')!
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
            <!-- Tabs -->
            <div class="flex border-b border-border-subtle bg-layer-02 h-12 shrink-0">
                <button v-for="tab in [{id: 'studio', label: 'Studio'}, {id: 'generate', label: 'Generate'}, {id: 'import', label: 'Import'}, {id: 'extended', label: 'Extended Code'}]" :key="tab.id"
                        @click="activeTab = tab.id as any"
                        :class="activeTab === tab.id ? 'border-interactive-01 text-interactive-01 bg-layer-01' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-layer-01/50'"
                        class="flex-1 h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors">
                    {{ tab.label }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto relative" :class="activeTab === 'extended' ? '' : 'p-6'">
                
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
                    <div class="flex-1 overflow-y-auto p-4 space-y-6">
                        
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
        </template>
    </ToolLayout>
</template>
