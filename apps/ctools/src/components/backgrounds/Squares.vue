```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(defineProps<{
    squareSize?: number
    speed?: number
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
    borderColor?: string
    hoverFillColor?: string
    gridMask?: string // Optional mask for the grid layer only
}>(), {
    squareSize: 80,
    speed: 0.05,
    direction: 'diagonal',
    borderColor: 'var(--border-subtle)', 
    hoverFillColor: 'var(--interactive-01)',
    gridMask: 'linear-gradient(to bottom, black 40%, transparent 100%)'
})

const gridCanvasRef = ref<HTMLCanvasElement | null>(null)
const highlightCanvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

let gridCtx: CanvasRenderingContext2D | null = null
let highlightCtx: CanvasRenderingContext2D | null = null

let animationId = 0
let gridOffset = { x: 0, y: 0 }
let mousePos = { x: -9999, y: -9999 }
const isDark = ref(false)

// Cache resolved colors to avoid getComputedStyle in loop
const effectiveBorderColor = ref('#000000')
const effectiveHoverColor = ref('#000000')

const resolveColor = (color: string) => {
    if (!color) return '#000000'
    if (color.startsWith('var(--')) {
        const varName = color.substring(4, color.length - 1)
        const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
        return computed || color
    }
    return color
}

const updateColors = () => {
    effectiveBorderColor.value = resolveColor(props.borderColor)
    effectiveHoverColor.value = resolveColor(props.hoverFillColor)
}

const resizeCanvases = () => {
    if (!containerRef.value || !gridCanvasRef.value || !highlightCanvasRef.value) return
    const { offsetWidth, offsetHeight } = containerRef.value
    
    gridCanvasRef.value.width = offsetWidth
    gridCanvasRef.value.height = offsetHeight
    
    highlightCanvasRef.value.width = offsetWidth
    highlightCanvasRef.value.height = offsetHeight
    
    // Draw immediately after resize
    drawGrid()
}

const drawGrid = () => {
    if (!gridCtx || !gridCanvasRef.value) return

    const width = gridCanvasRef.value.width
    const height = gridCanvasRef.value.height
    
    gridCtx.clearRect(0, 0, width, height)
    
    const startX = Math.floor(gridOffset.x / props.squareSize) * props.squareSize
    const startY = Math.floor(gridOffset.y / props.squareSize) * props.squareSize

    gridCtx.lineWidth = 1 
    gridCtx.strokeStyle = effectiveBorderColor.value
    
    for (let x = startX; x < width + props.squareSize; x += props.squareSize) {
        for (let y = startY; y < height + props.squareSize; y += props.squareSize) {
            const squareX = x - (gridOffset.x % props.squareSize)
            const squareY = y - (gridOffset.y % props.squareSize)

            gridCtx.strokeRect(squareX, squareY, props.squareSize, props.squareSize)
        }
    }
}

const updateGridOffset = () => {
    const effectiveSpeed = Math.max(props.speed, 0.1)
    switch (props.direction) {
        case 'right':
            gridOffset.x = (gridOffset.x - effectiveSpeed + props.squareSize) % props.squareSize
            break
        case 'left':
            gridOffset.x = (gridOffset.x + effectiveSpeed + props.squareSize) % props.squareSize
            break
        case 'up':
            gridOffset.y = (gridOffset.y + effectiveSpeed + props.squareSize) % props.squareSize
            break
        case 'down':
            gridOffset.y = (gridOffset.y - effectiveSpeed + props.squareSize) % props.squareSize
            break
        case 'diagonal':
            gridOffset.x = (gridOffset.x - effectiveSpeed + props.squareSize) % props.squareSize
            gridOffset.y = (gridOffset.y - effectiveSpeed + props.squareSize) % props.squareSize
            break
    }
}

const drawHighlight = () => {
    if (!highlightCtx || !highlightCanvasRef.value) return
    
    const width = highlightCanvasRef.value.width
    const height = highlightCanvasRef.value.height

    highlightCtx.clearRect(0, 0, width, height)

    if (mousePos.x === -9999 && mousePos.y === -9999) return

    // Calculate grid snap relative to the moving grid offset
    const xOffset = gridOffset.x % props.squareSize
    const yOffset = gridOffset.y % props.squareSize
    
    const squareX = (Math.floor((mousePos.x + xOffset) / props.squareSize) * props.squareSize) - xOffset
    const squareY = (Math.floor((mousePos.y + yOffset) / props.squareSize) * props.squareSize) - yOffset

    highlightCtx.fillStyle = effectiveHoverColor.value
    highlightCtx.fillRect(squareX, squareY, props.squareSize, props.squareSize)
}

const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    }
}

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
    updateColors()

    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                isDark.value = document.documentElement.classList.contains('dark')
                updateColors()
            }
        })
    })
    themeObserver.observe(document.documentElement, { attributes: true })

    const resizeObserver = new ResizeObserver(() => {
        resizeCanvases()
    })

    if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    if (gridCanvasRef.value && highlightCanvasRef.value) {
        gridCtx = gridCanvasRef.value.getContext('2d')
        highlightCtx = highlightCanvasRef.value.getContext('2d')
        resizeCanvases()
        
        
        const animate = () => {
            updateGridOffset()
            drawGrid()
            drawHighlight()
            animationId = requestAnimationFrame(animate)
        }
        animate()
    }

    onUnmounted(() => {
        themeObserver.disconnect()
        resizeObserver.disconnect()
        cancelAnimationFrame(animationId)
        window.removeEventListener('mousemove', handleMouseMove)
    })
})

watch(() => [props.squareSize, props.borderColor, props.speed, props.direction], () => {
    updateColors()
    drawGrid()
})

watch(() => props.hoverFillColor, () => {
    updateColors()
    // highlight drawn in loop
})
</script>

<template>
    <div ref="containerRef" 
         class="squares-container w-full h-full absolute inset-0 -z-0 bg-background overflow-hidden"
    >
        <!-- Grid Layer (Masked) -->
        <canvas ref="gridCanvasRef" 
            class="absolute inset-0 w-full h-full block pointer-events-none"
            :style="gridMask ? { maskImage: gridMask, WebkitMaskImage: gridMask } : {}"
        ></canvas>
        
        <!-- Highlight Layer (Unmasked) -->
        <canvas ref="highlightCanvasRef" 
            class="absolute inset-0 w-full h-full block pointer-events-none"
        ></canvas>
    </div>
</template>

<style scoped>
/* No CSS grid needed */
</style>
