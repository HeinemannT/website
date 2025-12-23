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
    class="relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer"
    :class="[
      isDragging 
        ? 'border-cora-500 bg-cora-50 dark:bg-cora-500/10' 
        : 'border-slate-200 dark:border-slate-700 hover:border-cora-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    ]"
  >
    <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
      <UploadCloud class="w-6 h-6 text-slate-400" :class="{ 'text-cora-500': isDragging }" />
    </div>
    <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
      Drag & Drop files here
    </p>
    <p class="text-xs text-slate-500 mt-1">
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
