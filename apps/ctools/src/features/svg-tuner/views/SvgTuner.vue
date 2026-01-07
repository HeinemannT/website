<script setup lang="ts">
import { ref, onMounted } from 'vue' // Added onMounted back, removed from original snippet
import ToolLayout from '@components/layout/ToolLayout.vue'
import ToolHeader from '@components/layout/ToolHeader.vue'
import SvgTunerControls from '../components/SvgTunerControls.vue'
import SvgTunerCanvas from '../components/SvgTunerCanvas.vue'
import { useSvgTuner } from '../composables/useSvgTuner'
import { TOOLS } from '@config/tools' // New import
import { Upload, Download, Code, Image } from 'lucide-vue-next' // Kept existing import
import { defaultSVG } from '../components/defaultSvg' // Kept existing import

const tool = TOOLS.find(t => t.id === 'tuner')! // New constant

const {
    svgCode,
    colors,
    dimensions,
    zoom,
    exportName,
    activeTab,
    paddingVal,
    optimizationStats,
    analyzeSVG,
    optimizeSVG,
    autoCrop,
    applyPadding,
    importFromUrl,
    updateColor,
    updateDimensions,
    downloadSVGFn,
    downloadPNGFn
} = useSvgTuner()

const canvasRef = ref<InstanceType<typeof SvgTunerCanvas> | null>(null)

// Actions orchestrated by parent

// Actions orchestrated by parent
const handleFileUploaded = () => {
    analyzeSVG()
    canvasRef.value?.fitToScreen()
}

const onUploadFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
             svgCode.value = evt.target?.result as string;
             handleFileUploaded();
        };
        reader.readAsText(file);
    }
}

const handleAutoCrop = () => {
    autoCrop()
}

onMounted(() => {
    // Optimization: Defer parsing to next frame to allow UI to paint first
    requestAnimationFrame(() => {
        svgCode.value = defaultSVG
        analyzeSVG()
        
        // Ensure accurate sizing after render
        setTimeout(() => {
            canvasRef.value?.fitToScreen()
        }, 50)
    })
})
</script>

<template>
  <ToolLayout sidebarClass="w-full lg:w-96 border-l border-border-subtle bg-layer-01 z-20">
    
    <!-- Main Canvas Area -->
    <template #main>
        <div class="flex flex-col h-full bg-background">
            <ToolHeader title="SVG Tuner" :theme="tool.headerTheme">
                <template #center>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-white/80 uppercase tracking-widest hidden lg:block">Name</span>
                            <input 
                                v-model="exportName"
                                placeholder="tuned svg"
                                class="w-32 lg:w-40 bg-transparent border-b border-white/30 hover:border-white focus:border-white font-bold text-white text-xs py-1 transition-colors outline-none placeholder-white/50"
                            />
                        </div>
                        <div class="w-px h-4 bg-white/20 hidden lg:block"></div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-white/80 uppercase tracking-widest hidden lg:block">Import URL</span>
                            <input 
                                type="text" 
                                placeholder="https://example.com/icon.svg" 
                                @keydown.enter="importFromUrl(($event.target as HTMLInputElement).value)"
                                class="w-32 lg:w-48 bg-transparent border-b border-white/30 hover:border-white focus:border-white outline-none text-xs py-1 transition-colors text-white placeholder-white/50"
                            />
                        </div>
                    </div>
                </template>

                <template #actions>
                    <div class="flex items-center gap-2">
                        <!-- Upload -->
                         <div class="flex items-center gap-2">
                             <label class="p-2 hover:bg-white/20 rounded-md text-white/90 hover:text-white transition-colors cursor-pointer" title="Upload File">
                                 <input type="file" accept=".svg" class="hidden" @change="onUploadFile" />
                                 <Upload class="w-4 h-4" />
                             </label>
                         </div>
                        <!-- Download Dropdown -->
                        <div class="relative group">
                            <button class="px-3 py-1.5 text-xs font-semibold text-white bg-black/20 hover:bg-black/30 rounded-none shadow-none flex items-center gap-2 transition-all">
                                <Download class="w-3.5 h-3.5" />
                                Download
                            </button>
                            <!-- Dropdown Menu -->
                            <div class="absolute right-0 top-full mt-1 w-32 bg-layer-01 border border-border-subtle rounded-none shadow-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-right">
                                <button @click="downloadSVGFn()" class="w-full text-left px-3 py-2 text-xs hover:bg-layer-02 text-text-primary flex items-center gap-2">
                                    <Code class="w-3 h-3 text-text-secondary" /> SVG
                                </button>
                                <button @click="downloadPNGFn()" class="w-full text-left px-3 py-2 text-xs hover:bg-layer-02 text-text-primary flex items-center gap-2">
                                    <Image class="w-3 h-3 text-text-secondary" /> PNG
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </ToolHeader>
            
            <SvgTunerCanvas 
                ref="canvasRef"
                v-model:zoom="zoom" 
                :svgCode="svgCode"
                :dimensions="dimensions" 
                class="flex-1 overflow-hidden"
            />
    </div>
</template>

<!-- Sidebar Controls -->
<template #sidebar>
    <SvgTunerControls 
        v-model:svgCode="svgCode"
        :colors="colors"
        :dimensions="dimensions"
        :optimizationStats="optimizationStats"
        v-model:activeTab="activeTab"
        v-model:paddingVal="paddingVal"
        @updateColor="updateColor"
        @updateDimensions="updateDimensions"
        @optimizeSVG="optimizeSVG"
        @autoCrop="handleAutoCrop"
        @applyPadding="applyPadding"
        @fileUploaded="handleFileUploaded"
        @importUrl="importFromUrl"
    />
</template>

</ToolLayout>
</template>
```
