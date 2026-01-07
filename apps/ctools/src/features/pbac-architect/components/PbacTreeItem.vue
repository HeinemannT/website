<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { Folder, FileText, ChevronRight, ChevronDown, Plus, Trash2, Edit2, GripVertical } from 'lucide-vue-next'
import type { FileSystemItem, Category } from '../types'

const props = defineProps<{
    item: FileSystemItem
    level: number
    selectedId: string
    renamingId?: string
}>()

const emit = defineEmits<{
    (e: 'select', id: string): void
    (e: 'toggle', id: string): void
    (e: 'add', parentId: string, type: 'Category' | 'Policy'): void
    (e: 'delete', id: string): void
    (e: 'rename', id: string, name: string): void
    (e: 'move', dragId: string, dropId: string, position: 'before' | 'after' | 'inside'): void
    // UI Events
    (e: 'context-menu', evt: MouseEvent, id: string, type: 'Category' | 'Policy'): void
    (e: 'request-rename', id: string): void
    (e: 'stop-rename'): void
}>()

const isCategory = computed(() => props.item.itemType === 'Category')
const children = computed(() => (props.item as Category).children || [])
const isCollapsed = computed(() => (props.item as Category).collapsed)

// -- Inline Renaming (Controlled) --
const isEditing = computed(() => props.renamingId === props.item.id)
const editName = ref('')
const inputRef = ref<any>(null)

watch(isEditing, (val) => {
    if (val) {
        editName.value = props.item.name
        nextTick(() => inputRef.value?.$el.querySelector('input')?.focus())
    }
})

const startEdit = () => {
    emit('request-rename', props.item.id)
}

const saveEdit = () => {
    if (isEditing.value) {
        if (editName.value.trim() && editName.value !== props.item.name) {
            emit('rename', props.item.id, editName.value)
        }
        emit('stop-rename')
    }
}

// -- Drag & Drop --
const dragOverPosition = ref<'before' | 'after' | 'inside' | null>(null)

const onDragStart = (e: DragEvent) => {
    if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', props.item.id)
        e.dataTransfer.dropEffect = 'move'
    }
}

const onDragOver = (e: DragEvent) => {
    e.preventDefault() // Allow drop
    e.stopPropagation()

    // No drop on self logic handled by parent move attempt usually, but good to check
    // Logic: ...
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const relY = e.clientY - rect.top
    const height = rect.height

    if (isCategory.value) {
        if (relY < height * 0.25) dragOverPosition.value = 'before'
        else if (relY > height * 0.75) dragOverPosition.value = 'after'
        else dragOverPosition.value = 'inside'
    } else {
        if (relY < height * 0.5) dragOverPosition.value = 'before'
        else dragOverPosition.value = 'after'
    }
}

const onDragLeave = () => {
    dragOverPosition.value = null
}

const onDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const dragId = e.dataTransfer?.getData('text/plain')
    if (dragId && dragOverPosition.value) {
        emit('move', dragId, props.item.id, dragOverPosition.value)
    }
    dragOverPosition.value = null
}
</script>

<template>
    <div class="select-none font-sans text-xs">
        <!-- Item Row -->
        <div 
            class="group flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-colors border-l-2 relative"
            :class="[
                selectedId === item.id 
                    ? 'bg-layer-02 border-interactive-01 text-text-primary' 
                    : 'bg-transparent border-transparent text-text-secondary hover:bg-layer-02 hover:text-text-primary',
                dragOverPosition === 'inside' ? 'bg-interactive-01/10 ring-1 ring-inset ring-interactive-01' : '',
            ]"
            :style="{ paddingLeft: `${level * 12 + 8}px` }"
            @click.stop="$emit('select', item.id)"
            @dblclick.stop="startEdit"
            @contextmenu.prevent.stop="$emit('context-menu', $event, item.id, item.itemType)"
            draggable="true"
            @dragstart="onDragStart"
            @dragover="onDragOver"
            @dragleave="onDragLeave"
            @drop="onDrop"
        >
            <!-- Drop Indicators (Lines) -->
            <div v-if="dragOverPosition === 'before'" class="absolute top-0 left-0 right-0 h-0.5 bg-interactive-01 z-50 pointer-events-none"></div>
            <div v-if="dragOverPosition === 'after'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-interactive-01 z-50 pointer-events-none"></div>

            <!-- Drag Handle (Visual only) -->
            <GripVertical class="w-3 h-3 text-text-disabled opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing" />

            <!-- Toggle / Spacer -->
            <button 
                v-if="isCategory" 
                @click.stop="$emit('toggle', item.id)"
                class="w-4 h-4 flex items-center justify-center rounded-sm hover:bg-layer-03 text-text-tertiary transition-colors"
            >
                <ChevronRight v-if="isCollapsed" class="w-3 h-3" />
                <ChevronDown v-else class="w-3 h-3" />
            </button>
            <span v-else class="w-4"></span>

            <!-- Icon -->
            <Folder v-if="isCategory" class="w-3.5 h-3.5 text-interactive-01" />
            <FileText v-else class="w-3.5 h-3.5 text-text-tertiary" />

            <!-- Label / Editor -->
            <div class="flex-1 overflow-hidden text-ellipsis whitespace-nowrap" v-if="!isEditing">
                {{ item.name }}
            </div>
            <div v-else class="flex-1 min-w-0" @click.stop>
                <input 
                    ref="inputRef"
                    v-model="editName" 
                    class="h-5 text-xs py-0 px-1 w-full bg-layer-03 text-text-primary border border-interactive-01 focus:outline-none rounded-sm -ml-1"
                    @blur="saveEdit"
                    @keydown.enter="saveEdit"
                    @keydown.esc="$emit('stop-rename')"
                />
            </div>

            <!-- Actions (Group Hover) -->
             <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1" v-if="!isEditing && (selectedId === item.id || isCategory)">
                <button @click.stop="startEdit" title="Rename" class="p-1 hover:bg-layer-03 rounded-sm text-text-tertiary hover:text-text-primary">
                    <Edit2 class="w-3 h-3" /><span class="sr-only">Rename</span>
                </button>
                <template v-if="isCategory">
                    <button @click.stop="$emit('add', item.id, 'Category')" title="Add Folder" class="p-1 hover:bg-layer-03 rounded-sm text-text-tertiary hover:text-text-primary"><Folder class="w-3 h-3" /><span class="sr-only">Add Folder</span></button>
                    <button @click.stop="$emit('add', item.id, 'Policy')" title="Add Policy" class="p-1 hover:bg-layer-03 rounded-sm text-text-tertiary hover:text-text-primary"><Plus class="w-3 h-3" /><span class="sr-only">Add Policy</span></button>
                </template>
                <button @click.stop="$emit('delete', item.id)" title="Delete" class="p-1 hover:bg-red-900/30 rounded-sm text-text-tertiary hover:text-red-500"><Trash2 class="w-3 h-3" /><span class="sr-only">Delete</span></button>
            </div>
        </div>

        <!-- Recursion -->
        <div v-if="isCategory && !isCollapsed">
            <PbacTreeItem 
                v-for="child in children" 
                :key="child.id" 
                :item="child" 
                :level="level + 1" 
                :selected-id="selectedId"
                :renaming-id="renamingId"
                @select="$emit('select', $event)"
                @toggle="$emit('toggle', $event)"
                @add="(pid, type) => $emit('add', pid, type)"
                @delete="$emit('delete', $event)"
                @rename="(id, val) => $emit('rename', id, val)"
                @move="(drag, drop, pos) => $emit('move', drag, drop, pos)"
                @context-menu="(e, id, type) => $emit('context-menu', e, id, type)"
                @request-rename="(id) => $emit('request-rename', id)"
                @stop-rename="$emit('stop-rename')"
                class="group"
            />
        </div>
    </div>
</template>
