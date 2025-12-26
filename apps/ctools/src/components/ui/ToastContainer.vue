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
  success: 'bg-slate-800 text-emerald-400 border-l-4 border-emerald-500',
  error: 'bg-slate-800 text-red-400 border-l-4 border-red-500',
  info: 'bg-slate-800 text-blue-400 border-l-4 border-blue-500'
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="pointer-events-auto px-4 py-3 rounded shadow-lg shadow-black/20 flex items-center gap-3 min-w-[300px] max-w-sm backdrop-blur-sm"
        :class="classes[toast.type]"
      >
        <component :is="icons[toast.type]" class="w-5 h-5 shrink-0" />
        <span class="text-sm font-medium text-slate-100 flex-1">{{ toast.message }}</span>
        <button @click="remove(toast.id)" class="text-slate-500 hover:text-white transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
