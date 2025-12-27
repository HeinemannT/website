<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useSvgTuner } from '../composables/useSvgTuner'
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
  <div class="flex h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
    
    <!-- LEFT: Preview Canvas -->
    <SvgTunerCanvas 
        ref="canvasRef"
        v-model:zoom="tuner.zoom.value" 
        :svgCode="tuner.svgCode.value" 
    />

    <!-- RIGHT: Controls Panel -->
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
    
  </div>
</template>
