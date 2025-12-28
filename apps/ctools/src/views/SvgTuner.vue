<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSvgTuner } from '../composables/useSvgTuner'
import ToolLayout from '../components/layout/ToolLayout.vue'
import ToolHeader from '../components/layout/ToolHeader.vue'
import { Zap, Upload, Download, Code, Image } from 'lucide-vue-next'
import SvgTunerCanvas from '../components/tools/svg-tuner/SvgTunerCanvas.vue'
import SvgTunerControls from '../components/tools/svg-tuner/SvgTunerControls.vue'
import { defaultSVG } from '../components/tools/svg-tuner/defaultSvg'

const tuner = useSvgTuner()
const canvasRef = ref<InstanceType<typeof SvgTunerCanvas> | null>(null)

// Actions orchestrated by parent
const handleFileUploaded = () => {
    tuner.analyzeSVG()
    canvasRef.value?.fitToScreen()
}

const onUploadFile = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
             tuner.svgCode.value = evt.target?.result as string;
             handleFileUploaded();
        };
        reader.readAsText(file);
    }
}

const handleAutoCrop = () => {
    tuner.autoCrop()
    // Need to update dimensions locally in tuner? autoCrop does it.
}

onMounted(() => {
    tuner.svgCode.value = defaultSVG
    tuner.analyzeSVG()
    // Ensure accurate sizing after render
    setTimeout(() => {
        canvasRef.value?.fitToScreen()
        // Second check for stability
        requestAnimationFrame(() => canvasRef.value?.fitToScreen())
    }, 50)
})
</script>

<template>
  <ToolLayout sidebarClass="w-full lg:w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-20">
    
    <!-- Main Canvas Area -->
    <template #main>
        <div class="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            <ToolHeader title="SVG Tuner" :icon="Zap" icon-color="text-amber-600 dark:text-amber-400">
                <template #center>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Name</span>
                            <input 
                                v-model="tuner.exportName.value"
                                placeholder="tuned svg"
                                class="w-32 lg:w-40 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 font-bold text-slate-700 dark:text-slate-200 text-xs py-1 transition-colors outline-none placeholder-slate-400"
                            />
                        </div>
                        <div class="w-px h-4 bg-slate-200 dark:bg-slate-800 hidden lg:block"></div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden lg:block">Import URL</span>
                            <input 
                                type="text" 
                                placeholder="https://example.com/icon.svg" 
                                @keydown.enter="tuner.importFromUrl(($event.target as HTMLInputElement).value)"
                                class="w-32 lg:w-48 bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 focus:border-amber-500 outline-none text-xs py-1 transition-colors"
                            />
                        </div>
                    </div>
                </template>

                <template #actions>
                    <div class="flex items-center gap-2">
                        <!-- Upload -->
                         <div class="relative">
                            <input 
                                type="file" 
                                accept=".svg" 
                                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                @change="onUploadFile"
                            />
                            <div class="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-2 transition-colors">
                                <Upload class="w-3.5 h-3.5" />
                                Upload
                            </div>
                         </div>

                        <!-- Download Dropdown -->
                        <div class="relative group">
                            <button class="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm flex items-center gap-2 transition-all">
                                <Download class="w-3.5 h-3.5" />
                                Download
                            </button>
                            <!-- Dropdown Menu -->
                            <div class="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden transform origin-top-right">
                                <button @click="tuner.downloadSVGFn()" class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <Code class="w-3 h-3 text-slate-400" /> SVG
                                </button>
                                <button @click="tuner.downloadPNGFn()" class="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <Image class="w-3 h-3 text-slate-400" /> PNG
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </ToolHeader>
            
            <SvgTunerCanvas 
                ref="canvasRef"
                v-model:zoom="tuner.zoom.value" 
                :svgCode="tuner.svgCode.value" 
                class="flex-1 overflow-hidden"
            />
        </div>
    </template>

    <!-- Sidebar Controls -->
    <template #sidebar>
        <SvgTunerControls 
            v-model:svgCode="tuner.svgCode.value"
            :colors="tuner.colors.value"
            :dimensions="tuner.dimensions.value"
            :optimizationStats="tuner.optimizationStats.value"
            v-model:activeTab="tuner.activeTab.value"
            v-model:paddingVal="tuner.paddingVal.value"
            @updateColor="tuner.updateColor"
            @updateDimensions="tuner.updateDimensions"
            @optimizeSVG="tuner.optimizeSVG"
            @autoCrop="handleAutoCrop"
            @applyPadding="tuner.applyPadding"
            @fileUploaded="handleFileUploaded"
            @importUrl="tuner.importFromUrl"
        />
    </template>
    
  </ToolLayout>
</template>
