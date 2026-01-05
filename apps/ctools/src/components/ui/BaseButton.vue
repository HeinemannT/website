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
  const base = "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
  
  // Carbon sizes: compact(32), default(40), lg(48)
  const sizes = {
    sm: "px-3 py-1.5 text-xs h-8",
    md: "px-4 py-2 text-sm h-10",
    lg: "px-6 py-3 text-base h-12",
    icon: "h-10 w-10 p-0"
  }

  const variants = {
    // Carbon Primary: Interactive-01
    solid: "bg-interactive-01 hover:bg-interactive-01-hover text-white rounded-none",
    
    // Carbon Secondary/Outline
    outline: "border border-interactive-01 text-interactive-01 bg-transparent hover:bg-layer-02 rounded-none",
    
    // Carbon Ghost
    ghost: "hover:bg-layer-02 text-text-primary hover:text-interactive-01 rounded-none",
    
    // Danger
    danger: "bg-red-600 hover:bg-red-700 text-white rounded-none"
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
