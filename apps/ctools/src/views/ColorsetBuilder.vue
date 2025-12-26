<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { Plus, Trash2, Palette, Wand2, ArrowRight, ExternalLink } from 'lucide-vue-next'
import tinycolor from 'tinycolor2' // Optimization: Use tinycolor directly
import { ScriptBuilder } from '../utils/ScriptBuilder'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ColorMatrix from '../components/colors/ColorMatrix.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
import { generateScale, generatePastel, generateShades, generateInterpolate } from '../utils/ColorGenerators'
import { useToast } from '../composables/useToast'
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
const rootParentId = ref('dashboards_colors_folder')
const setName = ref('New Palette')
const setId = ref('')

const palette = ref<ColorStart[]>([
    { id: '', name: 'Color Name', hex: '#EF4444' },
    { id: '', name: 'Color Name', hex: '#EAB308' },
    { id: '', name: 'Color Name', hex: '#22C55E' }
])

const activeTab = ref<'studio' | 'generate' | 'import' | 'script'>('studio')
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
const genStrategy = ref('scale')
const genColors = ref<GeneratorOutput[]>([])
const interStart = ref('#EF4444')
const interEnd = ref('#3B82F6')
const interSteps = ref(5)

// --- Watchers & Sync ---
watch(selectedIndex, (newIdx) => {
    if (newIdx !== -1) {
        const col = palette.value[newIdx]
        if (col) {
            setColorState(col.hex)
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
    
    // Only auto-update ID if it is NOT empty (i.e. user has set it or it was generated)
    // User requested ID to be empty by default. If they type something, we keep it.
    // Actually, if it *matches* the old hex pattern, maybe update it? 
    // But user said "leave ID empty". So we don't auto-generate ID anymore.
    // We only update hex.

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
    genColors.value = []
    
    if (genStrategy.value === 'interpolate') {
        const cols = generateInterpolate(interStart.value, interEnd.value, interSteps.value)
        genColors.value = cols
        return
    }

    const selectedColor = palette.value[selectedIndex.value]
    if (selectedIndex.value === -1 || !selectedColor) return
    const base = selectedColor.hex

    if (genStrategy.value === 'scale') {
        genColors.value = generateScale(base)
    } else if (genStrategy.value === 'pastel') {
        genColors.value = generatePastel(base)
    } else if (genStrategy.value === 'shades') {
        genColors.value = generateShades(base)
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
    const parent = rootParentId.value || 't'
    const sb = new ScriptBuilder(`Set: ${setName.value}`)
    
    sb.createObjectVar('targetFolder', parent, 'Folder', { 
        id: setId.value, 
        name: setName.value 
    })
    sb.addNewLine()
    
    palette.value.forEach(col => {
        sb.createObject('targetFolder', 'Color', { 
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
    const lines = importContent.value.split('\n')
    let count = 0
    lines.forEach(line => {
        const match = line.match(/#[a-fA-F0-9]{6}/)
        if (match) {
            const hex = match[0].toUpperCase()
            palette.value.push({
                id: 'color_' + hex.replace('#', '').toLowerCase(),
                name: hex,
                hex
            })
            count++
        }
    })
    toast(`Imported ${count} colors`, 'info')
    importContent.value = ''
    activeTab.value = 'studio'
}

</script>

<template>
    <ToolLayout sidebarClass="lg:w-[45%]">
        
        <!-- Main: Palette Grid -->
        <template #main>
            <!-- Header Actions -->
            <div class="p-6 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
                <div class="flex items-start justify-between gap-6">
                    <div class="flex-1 space-y-3">
                         <input v-model="setName" class="text-3xl font-extrabold bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:border-solid outline-none placeholder-slate-400 w-full transition-colors" placeholder="Palette Name" />
                         <div class="flex items-center gap-2">
                             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</span>
                             <input v-model="setId" class="text-sm font-mono text-purple-600 dark:text-purple-400 bg-transparent border-b border-dashed border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:border-solid outline-none transition-colors" />
                         </div>
                    </div>
                    <button @click="addColor" class="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-transform">
                        <Plus class="w-4 h-4" /> New Color
                    </button>
                </div>
            </div>

            <!-- Grid -->
            <div class="flex-1 overflow-y-auto p-6">
                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="(col, idx) in palette" :key="idx" 
                         @click="selectedIndex = idx"
                         :class="{'ring-2 ring-indigo-500 shadow-xl scale-[1.02]': selectedIndex === idx, 'hover:scale-[1.01]': selectedIndex !== idx}"
                         class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 group relative">
                        
                        <div :style="{ backgroundColor: col.hex }" class="h-20 rounded-lg shadow-inner mb-3 relative overflow-hidden">
                             <button @click.stop="deleteColor(idx)" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><Trash2 class="w-3 h-3" /></button>
                        </div>
                        
                        <input v-model="col.name" @click.stop class="w-full bg-transparent text-xs font-bold mb-1 border-none p-0 focus:ring-0" />
                        <span class="block text-[10px] font-mono text-slate-400 uppercase">{{ col.hex }}</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Sidebar: Studio -->
        <template #sidebar>
            <!-- Tabs -->
            <div class="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <button v-for="tab in ['studio', 'generate', 'import', 'script']" :key="tab"
                        @click="activeTab = tab as any"
                        :class="activeTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600'"
                        class="flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors">
                    {{ tab }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 relative">
                
                <!-- STUDIO -->
                <div v-if="activeTab === 'studio'" class="h-full flex flex-col">
                    <div v-if="selectedIndex === -1" class="flex-1 flex flex-col items-center justify-center text-slate-400">
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
                            <div class="w-8 relative rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden cursor-ns-resize"
                                 ref="hueContainer"
                                 @mousedown="isHueDragging = true; $event.preventDefault(); updateHueFromMouse($event)"
                                 style="background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)">
                                 <!-- Thumb -->
                                 <div class="absolute left-0 right-0 h-1.5 bg-white border border-slate-400 rounded-sm shadow-sm pointer-events-none -translate-y-1/2"
                                      :style="{ top: `${(currentHue / 360) * 100}%` }"></div>
                            </div>
                        </div>

                        <!-- Saturation Slider -->
                        <div class="space-y-2 mb-6">
                            <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Saturation ({{ Math.round(currentSat) }}%)</span>
                            </div>
                            <input type="range" v-model.number="currentSat" min="0" max="100" @input="updateColorFromHsv" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>

                        <!-- Brightness Slider -->
                        <div class="space-y-2 mb-6">
                            <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                <span>Brightness ({{ Math.round(currentVal) }}%)</span>
                            </div>
                            <input type="range" v-model.number="currentVal" min="0" max="100" @input="updateColorFromHsv" class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                        </div>

                        <!-- Data Inputs & Preview -->
                        <div class="flex gap-4">
                            <div class="w-20 h-20 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 shrink-0" 
                                 :style="{backgroundColor: currentHex}"></div>
                            
                            <div class="flex-1 space-y-4">
                                <div class="flex items-center gap-2">
                                    <!-- Removed # prefix span -->
                                    <input v-model="currentHex" @input="(e) => updateColorFromHex((e.target as HTMLInputElement).value)" class="text-3xl font-mono font-medium bg-transparent border-b border-slate-300 dark:border-slate-600 w-full focus:outline-none focus:border-indigo-500 uppercase" maxlength="7" />
                                </div>
                                <div class="flex gap-2 text-xs font-mono">
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">R</label>
                                        <input v-model.number="currentRgb.r" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">G</label>
                                        <input v-model.number="currentRgb.g" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">B</label>
                                        <input v-model.number="currentRgb.b" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label class="text-[10px] uppercase font-bold text-slate-400 block mb-2">Metadata</label>
                            <BaseInput v-if="palette[selectedIndex]" label="Name" v-model="palette[selectedIndex]!.name" @change="updateModel" class="mb-3" />
                            <BaseInput v-if="palette[selectedIndex]" label="ID" v-model="palette[selectedIndex]!.id" mono />
                        </div>
                    </div>
                </div>

                <!-- GENERATE -->
                <div v-if="activeTab === 'generate'" class="space-y-6">
                    <div class="space-y-3">
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Strategy</label>
                        <select v-model="genStrategy" @change="generatePreview" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                            <option value="scale">Material Scale (100-900)</option>
                            <option value="pastel">Pastel Variations</option>
                            <option value="shades">Deep Shades</option>
                            <option value="interpolate">Range Interpolation</option>
                        </select>
                    </div>

                    <div v-if="selectedIndex !== -1 && palette[selectedIndex]" class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                         <div class="w-10 h-10 rounded shadow-sm" :style="{backgroundColor: palette[selectedIndex]?.hex}"></div>
                         <div>
                             <span class="text-[10px] uppercase font-bold text-slate-400">Base Color</span>
                             <div class="text-xs font-bold">{{ palette[selectedIndex]?.name }}</div>
                         </div>
                    </div>

                    <div v-if="genStrategy === 'interpolate'" class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div class="flex items-center gap-4">
                            <input type="color" v-model="interStart" @input="generatePreview" class="h-8 w-8 rounded cursor-pointer border-none p-0" />
                            <ArrowRight class="w-4 h-4 text-slate-400" />
                            <input type="color" v-model="interEnd" @input="generatePreview" class="h-8 w-8 rounded cursor-pointer border-none p-0" />
                        </div>
                        <div>
                            <div class="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>Steps</span> <span>{{ interSteps }}</span>
                            </div>
                            <input type="range" v-model.number="interSteps" min="3" max="12" @input="generatePreview" class="w-full accent-indigo-500" />
                        </div>
                    </div>

                    <div v-if="selectedIndex === -1 && genStrategy !== 'interpolate'" class="text-center py-8 text-slate-400 text-xs italic">
                        Select a base color in the grid to generate variations.
                    </div>

                    <div v-else class="space-y-4">
                        <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>Preview</span>
                        </div>
                        <div class="space-y-2">
                            <div v-for="(g, i) in genColors" :key="i" class="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                                <div class="w-8 h-8 rounded shadow-sm" :style="{backgroundColor: g.hex}"></div>
                                <div class="flex-1">
                                    <div class="text-xs font-bold">{{ g.name }}</div>
                                    <div class="text-[10px] font-mono text-slate-400">{{ g.hex }}</div>
                                </div>
                            </div>
                        </div>
                        <BaseButton class="w-full" @click="commitGenerated"><Wand2 class="w-4 h-4 mr-2" /> Add Colors</BaseButton>
                    </div>
                </div>

                <!-- IMPORT -->
                <div v-if="activeTab === 'import'" class="space-y-6">
                    <p class="text-xs text-slate-500">Paste text containing hex codes (e.g. from Coolors, Figma, CSS).</p>
                    <textarea v-model="importContent" class="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" placeholder="#FF0000&#10;#00FF00&#10;..."></textarea>
                    <BaseButton class="w-full" @click="processPaste">Import Found Colors</BaseButton>
                    
                    <div class="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                        <label class="text-[10px] uppercase font-bold text-slate-400">External Tools</label>
                        <div class="grid grid-cols-1 gap-2">
                             <a href="https://coolors.co/" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Coolors.co <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://color.adobe.com/create/color-wheel" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Adobe Color <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://colorhunt.co/" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Color Hunt <ExternalLink class="w-3 h-3" />
                             </a>
                        </div>
                    </div>
                </div>

                <!-- SCRIPT -->
                <div v-if="activeTab === 'script'" class="h-full flex flex-col">
                     <CodeOutputPanel title="Generated Script" :code="scriptOutput">
                         <template #actions>
                             <div class="w-40">
                                 <input v-model="rootParentId" placeholder="Context Folder" class="w-full text-xs border-b border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none pb-1 placeholder-slate-400" />
                             </div>
                         </template>
                     </CodeOutputPanel>
                </div>
            </div>
        </template>
    </ToolLayout>
</template>
