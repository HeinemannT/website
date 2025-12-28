<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
    squareSize?: number
    speed?: number
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
    borderColor?: string
    borderColorDark?: string
    hoverFillColor?: string
}>(), {
    squareSize: 22,
    speed: 0.5,
    direction: 'diagonal',
    borderColor: '#e2e8f0', // Slate-200
    hoverFillColor: '#9333ea', // Purple-600
    borderColorDark: '#1e293b' // Slate-800
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationId = 0
let gridOffset = { x: 0, y: 0 }
let mousePos = { x: -9999, y: -9999 }
const isDark = ref(false)

// Animation state
const resizeCanvas = () => {
    if (!canvasRef.value || !containerRef.value) return
    const { offsetWidth, offsetHeight } = containerRef.value
    canvasRef.value.width = offsetWidth
    canvasRef.value.height = offsetHeight
    // Redraw immediately on resize
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
    // Use dark border color if dark mode is active
    ctx.strokeStyle = isDark.value ? props.borderColorDark : props.borderColor

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            // Compute animated position
            const x = (startX + i) * props.squareSize - gridOffset.x
            const y = (startY + j) * props.squareSize - gridOffset.y
            
            // Draw Border
            ctx.strokeRect(x, y, props.squareSize, props.squareSize)
            
            // Check Hover
            if (mousePos.x >= x && mousePos.x < x + props.squareSize &&
                mousePos.y >= y && mousePos.y < y + props.squareSize) {
                
                // Create Gradient for Hover (Adjust lighter for dark mode?)
                const gradient = ctx.createLinearGradient(x, y, x + props.squareSize, y + props.squareSize)
                if (isDark.value) {
                     gradient.addColorStop(0, '#c084fc') // Purple-400
                     gradient.addColorStop(1, '#818cf8') // Indigo-400
                } else {
                     gradient.addColorStop(0, '#9333ea')
                     gradient.addColorStop(1, '#4f46e5')
                }
                
                ctx.fillStyle = gradient
                ctx.globalAlpha = 1 // Hover is solid
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
    // Initial Dark Mode Check
    isDark.value = document.documentElement.classList.contains('dark')

    // Mutation Observer for Theme Changes
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                isDark.value = document.documentElement.classList.contains('dark')
                draw()
            }
        })
    })
    themeObserver.observe(document.documentElement, { attributes: true })

    // Resize Observer for container size changes
    const resizeObserver = new ResizeObserver(() => {
        resizeCanvas()
    })

    if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
    }

    if (canvasRef.value) {
        ctx = canvasRef.value.getContext('2d')
        resizeCanvas()
        
        // Start animation
        animationId = requestAnimationFrame(update)
    }

    // Cleanup on unmount
    onUnmounted(() => {
        themeObserver.disconnect()
        resizeObserver.disconnect()
        cancelAnimationFrame(animationId)
    })
})

 // Re-draw/init on props change
watch(() => [props.squareSize, props.speed, props.direction, props.borderColor, props.borderColorDark], () => {
    // No full reset needed, update loop catches new props
})
</script>

<template>
    <div ref="containerRef" 
         class="squares-container w-full h-full absolute inset-0 -z-0 bg-slate-50 dark:bg-[#0B1120] overflow-hidden"
         @mousemove="handleMouseMove"
         @mouseleave="handleMouseLeave"
    >
        <canvas ref="canvasRef" class="w-full h-full block"></canvas>
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-slate-50/90 dark:to-[#0B1120]/90"></div>
    </div>
</template>

<style scoped>
/* No CSS grid needed */
</style>
