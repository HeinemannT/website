<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    GripVertical, 
    Copy, 
    Trash2, 
    File, 
    BarChart3, 
    Table as TableIcon,
    LayoutTemplate,
    Database,
    Target,
    Plus, 
    X
} from 'lucide-vue-next'
import { useTemplateBuilder, type LayoutItem, createLayoutItem } from '../composables/useTemplateBuilder'
import { INVENTORY, type InventoryItem } from '../constants'
import MockWidget from './MockWidget.vue'
import { onMounted } from 'vue'

const props = defineProps<{
    isPreview: boolean,
    isPaintMode: boolean
}>()

const emit = defineEmits<{
    (e: 'paint', id: string): void
}>()

const {
    rootPage,
    widgets,
    selectedItemId,
    selectItem,
    setRootPage,
    removeItem,
    // Tabs
    tabs,
    activeTabId,
    addTab,
    removeTab,
    setActiveTab,
    ensureInitialized
} = useTemplateBuilder()

onMounted(() => {
    ensureInitialized()
})

// --- Inventory & Icons ---
const inventoryPages = computed(() => INVENTORY.filter(i => i.category === 'Pages'))

const getIcon = (id: string, type?: string) => {
    if (type === 'page') return LayoutTemplate
    if (id.includes('Scorecard')) return Target
    if (id.includes('Data')) return Database
    if (id.includes('Chart')) return BarChart3
    if (id.includes('Table')) return TableIcon
    return File
}

// --- Grid Constants ---
const COLS = 6
const ROW_HEIGHT = 100

// --- Actions : Clone / Reset ---
const confirmReset = () => {
    if (confirm('Are you sure you want to clear the layout?')) {
        rootPage.value = null
        widgets.value = []
    }
}

const cloneItem = (id: string) => {
    const original = widgets.value.find(i => i.id === id)
    if (!original) return
    
    // Find next available spot (simple scan)
    let nextY = original.y + original.h
    
    const definition = INVENTORY.find(i => i.id === original.inventoryId)
    if (!definition) return

    const copy: LayoutItem = createLayoutItem(definition)
    copy.instanceName = original.instanceName + ' (Copy)'
    copy.x = original.x
    copy.y = nextY
    copy.w = original.w
    copy.h = original.h
    copy.headerColor = original.headerColor
    copy.headerTextColor = original.headerTextColor
    copy.props = JSON.parse(JSON.stringify(original.props)) // Deep copy props
    
    widgets.value.push(copy)
}

const handleItemClick = (id: string) => {
    if (props.isPreview) return
    if (props.isPaintMode) {
        emit('paint', id)
        return
    }
    selectItem(id)
}

// --- DRAG & DROP LOGIC (Custom Coordinate System) ---
const dragState = ref<{
    itemId: string
    startX: number
    startY: number
    initialGridX: number
    initialGridY: number
    currentGridX: number
    currentGridY: number
} | null>(null)

const containerRef = ref<HTMLElement | null>(null)
const gridRect = ref<DOMRect | null>(null)

const startDrag = (e: MouseEvent, item: LayoutItem) => {
    if (props.isPreview || props.isPaintMode) return
    
    e.preventDefault()
    e.stopPropagation()
    selectItem(item.id)
    
    // Refresh grid metrics
    if (containerRef.value) {
        gridRect.value = containerRef.value.getBoundingClientRect()
    }
    
    dragState.value = {
        itemId: item.id,
        startX: e.clientX,
        startY: e.clientY,
        initialGridX: item.x,
        initialGridY: item.y,
        currentGridX: item.x,
        currentGridY: item.y
    }
    
    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', onDragEnd)
}

const onDragMove = (e: MouseEvent) => {
    if (!dragState.value || !gridRect.value) return
    
    // Calculate Delta
    // Width of one column in px
    const colWidth = gridRect.value.width / COLS
    
    const deltaX = e.clientX - dragState.value.startX
    const deltaY = e.clientY - dragState.value.startY
    
    const gridDeltaX = Math.round(deltaX / colWidth)
    const gridDeltaY = Math.round(deltaY / ROW_HEIGHT)
    
    // Calc New Pos
    let nextX = dragState.value.initialGridX + gridDeltaX
    let nextY = dragState.value.initialGridY + gridDeltaY
    
    // Boundaries
    const item = widgets.value.find(i => i.id === dragState.value!.itemId)!
    if (!item) return

    nextX = Math.max(0, Math.min(COLS - item.w, nextX))
    nextY = Math.max(0, nextY)
    
    // Update Ghost State
    dragState.value.currentGridX = nextX
    dragState.value.currentGridY = nextY
}

const onDragEnd = () => {
    if (!dragState.value) return
    
    // Commit Change
    const item = widgets.value.find(i => i.id === dragState.value!.itemId)
    if (item) {
        item.x = dragState.value.currentGridX
        item.y = dragState.value.currentGridY
    }
    
    dragState.value = null
    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', onDragEnd)
}

// --- RESIZE LOGIC (Updated for 8-way) ---
const resizeState = ref<{
    itemId: string
    direction: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
    startX: number
    startY: number
    startW: number
    startH: number
    startX_Grid: number
    startY_Grid: number
} | null>(null)

const startResize = (e: MouseEvent, item: LayoutItem, direction: any) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (containerRef.value) gridRect.value = containerRef.value.getBoundingClientRect()
    
    resizeState.value = {
        itemId: item.id,
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startW: item.w,
        startH: item.h,
        startX_Grid: item.x,
        startY_Grid: item.y
    }
    window.addEventListener('mousemove', onResizeMove)
    window.addEventListener('mouseup', endResize)
}

const onResizeMove = (e: MouseEvent) => {
    if (!resizeState.value || !gridRect.value) return
    
    // Find item by ID to ensure reactivity
    const item = widgets.value.find(i => i.id === resizeState.value!.itemId)
    if (!item) return
    
    const colWidth = gridRect.value.width / COLS
    
    const deltaX_Px = e.clientX - resizeState.value.startX
    const deltaY_Px = e.clientY - resizeState.value.startY
    
    const deltaCols = Math.round(deltaX_Px / colWidth)
    const deltaRows = Math.round(deltaY_Px / ROW_HEIGHT)
    
    const dir = resizeState.value.direction
    
    // Horizontal Processing
    if (dir.includes('e')) {
        // Right Edge: Simple Width Change
        const maxW = COLS - resizeState.value.startX_Grid
        item.w = Math.max(1, Math.min(maxW, resizeState.value.startW + deltaCols))
    }
    else if (dir.includes('w')) {
        // Left Edge: Move X and Adjust W
        // New X must be >= 0.
        // New W must be >= 1.
        // New X = StartX + Delta
        let newX = resizeState.value.startX_Grid + deltaCols
        
        // Clamp X
        // Max X is (StartX + StartW - 1) -> To maintain at least width 1
        const maxX = resizeState.value.startX_Grid + resizeState.value.startW - 1
        newX = Math.max(0, Math.min(maxX, newX))
        
        // New W = StartW + (StartX - NewX)
        // If we moved right (positive delta), X increases, W decreases.
        // If we moved left (negative delta), X decreases, W increases.
        const widthChange = resizeState.value.startX_Grid - newX
        
        item.x = newX
        item.w = resizeState.value.startW + widthChange
    }
    
    // Vertical Processing
    if (dir.includes('s')) {
        // Bottom Edge: Simple Height Change
        item.h = Math.max(1, resizeState.value.startH + deltaRows)
    }
    else if (dir.includes('n')) {
        // Top Edge: Move Y and Adjust H
        let newY = resizeState.value.startY_Grid + deltaRows
        const maxY = resizeState.value.startY_Grid + resizeState.value.startH - 1
        newY = Math.max(0, Math.min(maxY, newY))
        
        const heightChange = resizeState.value.startY_Grid - newY
        
        item.y = newY
        item.h = resizeState.value.startH + heightChange
    }
}

const endResize = () => {
    resizeState.value = null
    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', endResize)
    // Force container height refresh if needed
}

// ... (Rest of component)
// In Template: Change cursor-grab/grabbing to cursor-move
// Line 368: cursor-move instead of cursor-grab active:cursor-grabbing


// Compute container height based on lowest item
const containerHeight = computed(() => {
    if (widgets.value.length === 0) return 600
    const maxY = Math.max(...widgets.value.map(i => i.y + i.h))
    return Math.max(600, maxY * ROW_HEIGHT + 100) // +100 padding
})
const onDragOver = (e: DragEvent) => {
    if (props.isPreview) return
    e.preventDefault() // Allow drop
    // Hint: Could show a specialized ghost for an external item here, but standard cursor is OK for MVP.
}

const onDrop = (e: DragEvent) => {
    if (props.isPreview) return
    e.preventDefault()
    
    // Check if it's an internal drag (handled by startDrag/mouse listeners)
    // If dragState is active, we might be dropping? No, internal drag uses window listeners.
    // This handler is mainly for External drops (Inventory).
    
    const json = e.dataTransfer?.getData('application/json')
    if (!json) return
    
    try {
        const itemDef = JSON.parse(json) as InventoryItem
        if (!itemDef || !itemDef.id) return
        
        // Calculate Position
        if (!containerRef.value) return
        const rect = containerRef.value.getBoundingClientRect()
        const colWidth = rect.width / COLS
        
        const relX = e.clientX - rect.left
        const relY = e.clientY - rect.top
        
        // Snap
        // Ensure new item fits within 6 cols. Default width is 6 (full), so likely 0.
        // But let's try to be smart. If width=6, x MUST be 0.
        // If we want to support smaller defaults, we'd check itemDef default props.
        // For now, createLayoutItem defaults to W=6.
        
        let gridX = Math.round(relX / colWidth)
        const gridY = Math.round(relY / ROW_HEIGHT)
        
        // Correct X for width
        // Create temp item to check defaults
        const newItem = createLayoutItem(itemDef)
        
        gridX = Math.max(0, Math.min(COLS - newItem.w, gridX))
        
        newItem.x = gridX
        newItem.y = Math.max(0, gridY)
        
        widgets.value.push(newItem)
        // Auto-select
        selectItem(newItem.id)
        
    } catch (err) {
        console.error('Invalid drop data', err)
    }
}
// --- OVERLAP DETECTION ---
// Simple AABB collision check
const overlappingIds = computed(() => {
    const ids = new Set<string>()
    const items = widgets.value

    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            const a = items[i]
            const b = items[j]
            
            if (!a || !b) continue

            // Check intersection logic (Grid Coordinates)
            // A.x < B.x + B.w && A.x + A.w > B.x ...
            const overlaps = (
                a.x < b.x + b.w && 
                a.x + a.w > b.x &&
                a.y < b.y + b.h && 
                a.y + a.h > b.y
            )

            if (overlaps) {
                ids.add(a.id)
                ids.add(b.id)
            }
        }
    }
    return ids
})

</script>

<template>
    <div class="flex-1 bg-layer-01 relative overflow-hidden flex flex-col">
        <div class="absolute inset-0 p-8 overflow-auto">
            
            <!-- EMPTY STATE -->
            <div v-if="!rootPage" class="h-full flex flex-col items-center justify-center fade-in">
                <!-- ... Same Empty State ... -->
                <div class="text-center mb-12">
                    <h2 class="text-3xl font-light text-text-primary mb-2 tracking-tight">New Template</h2>
                    <p class="text-text-secondary font-light">Select a root context to initialize the structure</p>
                </div>
                 <div class="grid grid-cols-3 gap-0 w-full max-w-4xl border border-border-subtle bg-layer-01">
                    <button 
                        v-for="page in inventoryPages" 
                        :key="page.id"
                        @click="setRootPage(createLayoutItem(page))"
                        class="flex flex-col items-start p-8 border-r border-border-subtle last:border-r-0 hover:bg-layer-02 transition-colors group text-left relative overflow-hidden"
                    >
                        <component :is="getIcon(page.id, 'page')" class="w-6 h-6 mb-3 text-text-secondary group-hover:text-interactive-01 transition-colors" />
                        <h3 class="text-lg font-normal text-text-primary mb-2">{{ page.label }}</h3>
                         <p class="text-xs text-text-secondary leading-relaxed max-w-[200px]">Initialize a new {{ page.label.toLowerCase() }} structure.</p>
                         <div class="absolute bottom-0 left-0 h-0.5 bg-interactive-01 w-0 group-hover:w-full transition-all duration-300"></div>
                    </button>
                </div>
            </div>

            <!-- EDITOR -->
            <div v-else class="max-w-[1920px] mx-auto min-h-full flex flex-col gap-6 fade-in">
                
                <!-- Carbon-style Header & Tabs -->
                <div class="flex flex-col bg-layer-02 shrink-0 border-b border-border-subtle">
                    
                    <!-- Top Bar: Context & Actions -->
                    <div class="flex items-center justify-between px-4 py-2">
                        <!-- Breadcrumb / Context -->
                        <div 
                            class="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-layer-hover transition-colors group"
                            @click.stop="selectItem(rootPage.id)"
                            :class="selectedItemId === rootPage.id ? 'bg-layer-selected text-interactive-01' : 'text-text-secondary'"
                        >
                            <component :is="getIcon(rootPage.inventoryId, 'page')" class="w-4 h-4" />
                            <span class="text-xs font-medium">{{ rootPage.instanceName }}</span>
                            <span class="text-[10px] opacity-50 uppercase tracking-wider ml-1">Root</span>
                        </div>

                        <!-- Global Actions -->
                        <button 
                            @click.stop="confirmReset" 
                            class="p-1.5 text-text-secondary hover:text-text-error hover:bg-layer-03 rounded-sm transition-colors"
                            title="Reset Layout"
                        >
                            <Trash2 class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Tab Rail -->
                    <div class="flex items-end px-4 gap-1 overflow-x-auto select-none">
                        <div 
                            v-for="tab in tabs" 
                            :key="tab.id"
                            @click="setActiveTab(tab.id)"
                            class="group relative min-w-[140px] max-w-[200px] h-10 px-4 flex items-center justify-between text-sm cursor-pointer transition-colors border-t-2"
                            :class="[
                                activeTabId === tab.id 
                                    ? 'bg-layer-01 text-text-primary border-t-interactive-01 font-medium' 
                                    : 'bg-transparent text-text-secondary border-t-transparent hover:bg-layer-hover-02 hover:text-text-primary'
                            ]"
                        >
                            <span class="truncate pr-6">{{ tab.name }}</span>

                            <!-- Active Indicator (Edit Mode) -->
                            <div v-if="activeTabId === tab.id" class="absolute top-0 left-0 right-0 h-0.5 bg-interactive-01"></div>

                            <!-- Remove Tab (Hover only) -->
                            <button 
                                v-if="tabs.length > 1"
                                @click.stop="removeTab(tab.id)"
                                class="absolute right-2 opacity-0 group-hover:opacity-100 p-1 hover:text-text-error hover:bg-layer-03 rounded transition-all"
                            >
                                <X class="w-3 h-3" />
                            </button>
                        </div>

                        <!-- Add Tab Button -->
                        <button 
                            @click="addTab"
                            class="h-10 w-10 flex items-center justify-center text-text-secondary hover:text-interactive-01 hover:bg-layer-hover-02 transition-colors mb-0.5 rounded-sm"
                            title="Add New Tab"
                        >
                            <Plus class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Main Grid (Coordinate System) -->
                <!-- Container -->
                <div 
                    ref="containerRef"
                    class="relative border rounded-lg bg-white dark:bg-layer-01 transition-colors drop-zone box-content"
                    :class="[
                        isPreview ? 'border-transparent' : 'border-dashed border-border-subtle', 
                        isPaintMode ? 'cursor-crosshair' : ''
                    ]"
                    :style="{ height: containerHeight + 'px' }"
                    @dragover="onDragOver"
                    @drop="onDrop"
                >
                    <!-- Visual Grid Background -->
                     <div v-if="!isPreview" class="absolute inset-0 grid grid-cols-6 pointer-events-none z-0">
                         <div v-for="i in 6" :key="i" class="border-l border-dashed border-layer-hover first:border-l-0 h-full"></div>
                     </div>
                     <div v-if="!isPreview" class="absolute inset-0 flex flex-col pointer-events-none z-0">
                          <div class="border-t border-dashed border-layer-hover w-full" :style="{ height: ROW_HEIGHT + 'px' }" v-for="i in Math.ceil(containerHeight/ROW_HEIGHT)" :key="i"></div>
                     </div>

                    <!-- Items -->
                    <div 
                        v-for="element in widgets" 
                        :key="element.id"
                        class="absolute transition-all duration-200 ease-out z-10 px-2 py-2 box-border"
                         :style="{ 
                            left: `${(dragState?.itemId === element.id ? dragState.currentGridX : element.x) * (100/6)}%`,
                            top: `${(dragState?.itemId === element.id ? dragState.currentGridY : element.y) * ROW_HEIGHT}px`,
                            width: `${element.w * (100/6)}%`,
                            height: `${element.h * ROW_HEIGHT}px`,
                            zIndex: dragState?.itemId === element.id ? 50 : (overlappingIds.has(element.id) ? 40 : 10)
                        }"
                    >
                         <!-- Inner Card -->
                         <div 
                            class="w-full h-full border bg-layer-01 relative flex flex-col overflow-hidden transition-all duration-200 group shadow-sm hover:shadow-md"
                             :class="[
                                !isPreview && selectedItemId === element.id 
                                ? 'border-interactive-01 ring-1 ring-interactive-01' 
                                : 'border-border-strong',
                                element.props?.shadow ? '!shadow-lg !border-none' : '',
                                overlappingIds.has(element.id) ? 'ring-2 ring-red-500 bg-red-500/10' : '',
                                isPreview && (element.props?.transparency === 100 || element.props?.borderStyle === 'NONE') ? '!border-none !shadow-none' : ''
                            ]"
                            :style="{
                                opacity: isPreview && element.props?.transparency ? (100 - element.props.transparency) / 100 : 1
                            }"
                            @click.stop="handleItemClick(element.id)"
                         >
                             <!-- Header / Drag Handle (Top) -->
                             <!-- z-40 to stay above the resize handles and drag overlay -->
                             <div 
                                v-if="!isPreview || element.props?.headerStyle !== 'NONE'"
                                class="shrink-0 h-7 flex items-center px-2 gap-2 border-b border-border-subtle relative transition-colors z-40 bg-layer-01"
                                :style="{ backgroundColor: element.headerColor || '#ffffff', color: element.headerTextColor || '#161616' }"
                             >
                                <span class="text-[10px] font-bold uppercase tracking-wider truncate flex-1 pointer-events-none select-none">{{ element.instanceName }}</span>
                                <div v-if="!isPreview" class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click.stop.prevent="cloneItem(element.id)" class="p-1 hover:bg-black/10 rounded cursor-pointer pointer-events-auto" title="Clone"><Copy class="w-3.5 h-3.5" /></button>
                                    <button @click.stop.prevent="removeItem(element.id)" class="p-1 hover:bg-text-error/10 hover:text-text-error rounded cursor-pointer pointer-events-auto" title="Remove"><Trash2 class="w-3.5 h-3.5" /></button>
                                </div>
                             </div>

                             <!-- Content -->
                             <div class="flex-1 relative overflow-hidden bg-layer-01 pointer-events-none flex flex-col items-center justify-center p-4 text-center">
                                <MockWidget v-if="isPreview" :type="element.inventoryId" :instance-name="element.instanceName" />
                                
                                <!-- Edit Mode Placeholder -->
                                <div v-else class="flex flex-col items-center gap-2 opacity-50">
                                    <component :is="getIcon(element.inventoryId)" class="w-8 h-8 text-text-tertiary" />
                                    <span class="text-xs font-mono text-text-tertiary">{{ element.w }}x{{ element.h }}</span>
                                </div>
                             </div>

                             <!-- OVERLAY DRAG HANDLE (Center) -->
                             <!-- Fix: Top-7 to avoid covering the header buttons -->
                             <div 
                                v-if="!isPreview" 
                                class="absolute top-7 bottom-0 left-0 right-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-move backdrop-blur-[1px] bg-white/50 dark:bg-black/30"
                                @mousedown.stop="(e) => startDrag(e, element)"
                             >
                                  <div class="bg-layer-01 border border-border-interactive shadow-sm rounded px-3 py-1.5 flex items-center gap-2 pointer-events-none select-none">
                                      <GripVertical class="w-4 h-4 text-text-secondary" />
                                      <div class="flex flex-col text-left">
                                           <span class="text-xs font-semibold text-text-primary">{{ element.instanceName }}</span>
                                           <span class="text-[10px] text-text-secondary font-mono">{{ element.w }}x{{ element.h }}</span>
                                      </div>
                                  </div>
                             </div>

                             <!-- Resize Handles (All 8 Directions) -->
                             <div v-if="!isPreview" class="absolute z-30 inset-0 pointer-events-none">
                                <!-- Corners -->
                                <div class="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize pointer-events-auto bg-white border border-interactive-01 rounded-full opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'nw')"></div>
                                <div class="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize pointer-events-auto bg-white border border-interactive-01 rounded-full opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'ne')"></div>
                                <div class="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize pointer-events-auto bg-white border border-interactive-01 rounded-full opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'sw')"></div>
                                <div class="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize pointer-events-auto bg-white border border-interactive-01 rounded-full opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'se')"></div>
                                
                                <!-- Edges -->
                                <div class="absolute top-0 left-1/2 -translate-x-1/2 -mt-1 w-12 h-2 cursor-n-resize pointer-events-auto flex justify-center opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'n')">
                                    <div class="w-8 h-1 bg-interactive-01/50 rounded-full"></div>
                                </div>
                                <div class="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-1 w-12 h-2 cursor-s-resize pointer-events-auto flex justify-center opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 's')">
                                    <div class="w-8 h-1 bg-interactive-01/50 rounded-full"></div>
                                </div>
                                <div class="absolute left-0 top-1/2 -translate-y-1/2 -ml-1 h-12 w-2 cursor-w-resize pointer-events-auto flex items-center opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'w')">
                                    <div class="h-8 w-1 bg-interactive-01/50 rounded-full"></div>
                                </div>
                                <div class="absolute right-0 top-1/2 -translate-y-1/2 -mr-1 h-12 w-2 cursor-e-resize pointer-events-auto flex items-center opacity-0 group-hover:opacity-100" @mousedown.stop="(e) => startResize(e, element, 'e')">
                                    <div class="h-8 w-1 bg-interactive-01/50 rounded-full"></div>
                                </div>
                             </div>

                         </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-in { animation: fadeIn 0.2s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
