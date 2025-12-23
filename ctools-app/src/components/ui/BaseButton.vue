<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface Props {
  variant?: 'solid' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
  disabled?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'solid',
  size: 'md',
  loading: false,
  disabled: false
})

const classes = computed(() => {
  const base = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
  
  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "h-9 w-9 p-0"
  }

  const variants = {
    solid: "bg-cora-600 hover:bg-cora-500 text-white shadow-sm shadow-cora-500/20 ring-cora-500",
    outline: "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 ring-slate-200",
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-500/20 ring-red-500"
  }

  return `${base} ${sizes[props.size]} ${variants[props.variant]}`
})
</script>

<template>
  <button :class="classes" :disabled="disabled || loading">
    <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
    <component :is="icon" v-else-if="icon" class="w-4 h-4 mr-2" />
    <slot />
  </button>
</template>
