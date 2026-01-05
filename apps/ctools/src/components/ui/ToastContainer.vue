<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

const { toasts, remove } = useToast()

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const classes = {
  success: 'border-l-4 border-l-support-success',
  error: 'border-l-4 border-l-support-error',
  info: 'border-l-4 border-l-interactive-01'
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="pointer-events-auto px-4 py-3 bg-layer-01 border border-border-subtle shadow-xl flex items-center gap-3 min-w-[300px] max-w-md"
        :class="[classes[toast.type]]"
      >
        <component :is="icons[toast.type]" class="w-4 h-4 shrink-0" />
        <span class="text-xs font-bold text-text-primary flex-1 leading-relaxed">{{ toast.message }}</span>
        <button @click="remove(toast.id)" class="text-text-disabled hover:text-text-primary transition-colors">
          <X class="w-4 h-4" />
        </button>
        
        <!-- Loading bar for auto-dismiss could be here, but simpler is better for now -->
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s cubic-bezier(0.2, 0, 0.38, 0.9);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
