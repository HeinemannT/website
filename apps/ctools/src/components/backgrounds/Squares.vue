<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
    squareSize?: number
    speed?: number
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
    borderColor?: string
    borderColorDark?: string // Deprecated if using CSS variables in borderColor
    hoverFillColor?: string
}>(), {
    squareSize: 22,
    speed: 0.5,
    direction: 'diagonal',
    borderColor: '#e2e8f0', 
    hoverFillColor: 'var(--interactive-01)',
    borderColorDark: '' 
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let gridOffset = { x: 0, y: 0 }
let mousePos = { x: -9999, y: -9999 }
const isDark = ref(false)

// Helper to resolve CSS variable
const resolveColor = (color: string) => {
    if (!color) return '#000000'
    if (color.startsWith('var(--')) {
        // Remove var( and )
        const varName = color.substring(4, color.length - 1)
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
        return computed || color
    }
    return color
}

// Animation state
const resizeCanvas = () => {
    if (!canvasRef.value || !containerRef.value) return
    const { offsetWidth, offsetHeight } = containerRef.value
    canvasRef.value.width = offsetWidth
    canvasRef.value.height = offsetHeight
    draw()
}

const draw = () => {
    if (!ctx || !canvasRef.value) return

    const width = canvasRef.value.width
    const height = canvasRef.value.height
    
    // Clear
    ctx.clearRect(0, 0, width, height)
    
    // Calculate Grid
    const startX = Math.floor(gridOffset.x / props.squareSize) - 1
    const startY = Math.floor(gridOffset.y / props.squareSize) - 1
    const cols = Math.ceil(width / props.squareSize) + 2
    const rows = Math.ceil(height / props.squareSize) + 2

    ctx.lineWidth = 1 
    
    // Resolve color dynamically (in case theme changed)
    // If props.borderColor is a variable, it handles dark/light automatically via getComputedStyle
    ctx.strokeStyle = resolveColor(props.borderColor)

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const x = (startX + i) * props.squareSize - gridOffset.x
            const y = (startY + j) * props.squareSize - gridOffset.y
            
            // Draw Border
            ctx.strokeRect(x, y, props.squareSize, props.squareSize)
            
            // Check Hover
            if (mousePos.x >= x && mousePos.x < x + props.squareSize &&
                mousePos.y >= y && mousePos.y < y + props.squareSize) {
                
                ctx.fillStyle = resolveColor(props.hoverFillColor)
                ctx.globalAlpha = 1 
                ctx.fillRect(x, y, props.squareSize, props.squareSize)
                ctx.globalAlpha = 1
            }
        }
    }
}

const update = () => {
    switch (props.direction) {
        case 'diagonal':
            gridOffset.x = (gridOffset.x + props.speed) % props.squareSize
            gridOffset.y = (gridOffset.y + props.speed) % props.squareSize
            break
        case 'right':
            gridOffset.x = (gridOffset.x + props.speed) % props.squareSize
            break
        case 'left':
            gridOffset.x = (gridOffset.x - props.speed) % props.squareSize
            break
        case 'up':
            gridOffset.y = (gridOffset.y - props.speed) % props.squareSize
            break
        case 'down':
            gridOffset.y = (gridOffset.y + props.speed) % props.squareSize
            break
    }
    draw()
    animationId = requestAnimationFrame(update)
}

const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

const handleMouseLeave = () => {
    mousePos = { x: -9999, y: -9999 }
}

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')

    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                isDark.value = document.documentElement.classList.contains('dark')
                // Force redraw to catch new CSS variable values
                draw()
            }
        })
    })
    themeObserver.observe(document.documentElement, { attributes: true })

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas()
    })

    if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
    }

    if (canvasRef.value) {
        ctx = canvasRef.value.getContext('2d')
        resizeCanvas()
        animationId = requestAnimationFrame(update)
    }

    onUnmounted(() => {
        themeObserver.disconnect()
        resizeObserver.disconnect()
        cancelAnimationFrame(animationId)
    })
})

 // Re-draw/init on props change
watch(() => [props.squareSize, props.speed, props.direction, props.borderColor], () => {
    // No full reset needed
})
</script>

<template>
    <div ref="containerRef" 
         class="squares-container w-full h-full absolute inset-0 -z-0 bg-background overflow-hidden"
         @mousemove="handleMouseMove"
         @mouseleave="handleMouseLeave"
    >
        <canvas ref="canvasRef" class="w-full h-full block"></canvas>
    </div>
</template>

<style scoped>
/* No CSS grid needed */
</style>
