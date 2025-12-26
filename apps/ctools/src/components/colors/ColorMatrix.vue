<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
    hue: number,
    saturation: number,
    value: number,
    hex: string
}>()

const emit = defineEmits<{
    (e: 'update', s: number, v: number): void
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const container = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)

const draw = () => {
    const ctx = canvas.value?.getContext('2d')
    if (!ctx || !canvas.value) return

    const w = canvas.value.width
    const h = canvas.value.height

    ctx.clearRect(0, 0, w, h)

    // Horizontal gradient: White -> Pure Color
    const gradH = ctx.createLinearGradient(0, 0, w, 0)
    gradH.addColorStop(0, '#fff')
    gradH.addColorStop(1, `hsl(${props.hue}, 100%, 50%)`)
    ctx.fillStyle = gradH
    ctx.fillRect(0, 0, w, h)

    // Vertical gradient: Transparent -> Black
    const gradV = ctx.createLinearGradient(0, 0, 0, h)
    gradV.addColorStop(0, 'rgba(0,0,0,0)')
    gradV.addColorStop(1, '#000')
    ctx.fillStyle = gradV
    ctx.fillRect(0, 0, w, h)
}

const updateFromMouse = (e: MouseEvent) => {
    if (!container.value) return
    const rect = container.value.getBoundingClientRect()
    let x = e.clientX - rect.left
    let y = e.clientY - rect.top

    // Clamp
    x = Math.max(0, Math.min(x, rect.width))
    y = Math.max(0, Math.min(y, rect.height))

    const s = (x / rect.width) * 100
    const v = 100 - ((y / rect.height) * 100)

    emit('update', s, v)
}

const handleMouseDown = (e: MouseEvent) => {
    isDragging.value = true
    updateFromMouse(e)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.value) updateFromMouse(e)
}

const handleMouseUp = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseup', handleMouseUp)
}

onMounted(() => {
    if (canvas.value) {
        canvas.value.width = 300 // Resolution
        canvas.value.height = 300
        draw()
    }
})

watch(() => props.hue, draw)
</script>

<template>
    <div class="flex-1 relative rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden cursor-crosshair shadow-sm"
            ref="container"
            @mousedown.prevent="handleMouseDown">
        <canvas ref="canvas" class="w-full h-full block"></canvas>
        <!-- Cursor -->
        <div class="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm ring-1 ring-black/20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                :style="{
                    left: `${saturation}%`,
                    top: `${100 - value}%`,
                    backgroundColor: hex
                }"></div>
    </div>
</template>
