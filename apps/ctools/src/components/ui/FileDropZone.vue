<script setup lang="ts">
import { ref } from 'vue'
import { UploadCloud } from 'lucide-vue-next'

const emit = defineEmits(['drop'])
const isDragging = ref(false)

function onDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
  if (e.dataTransfer?.files) {
    emit('drop', e.dataTransfer.files)
  }
}

function onDragOver(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function onDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}
</script>

<template>
  <div 
    @drop="onDrop" 
    @dragover="onDragOver" 
    @dragleave="onDragLeave"
    class="relative border-2 border-dashed rounded-none flex flex-col items-center justify-center p-8 transition-colors cursor-pointer"
    :class="[
      isDragging 
        ? 'border-interactive-01 bg-layer-02' 
        : 'border-border-strong hover:border-interactive-01 hover:bg-layer-02'
    ]"
  >
    <div class="p-3 bg-layer-01 rounded-full mb-3 hidden">
      <UploadCloud class="w-6 h-6 text-text-secondary" :class="{ 'text-interactive-01': isDragging }" />
    </div>
    <p class="text-sm font-medium text-text-primary">
      Drag & Drop files here
    </p>
    <p class="text-xs text-text-secondary mt-1">
      or click to browse
    </p>
    
    <!-- Fallback file input handles click -->
    <input 
      type="file" 
      multiple 
      class="absolute inset-0 opacity-0 cursor-pointer"
      @change="(e) => emit('drop', (e.target as HTMLInputElement).files)"
    />
  </div>
</template>
