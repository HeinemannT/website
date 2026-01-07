<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { Folder, FileText, Book, Download, Code as CodeIcon } from 'lucide-vue-next'
import MonacoEditor from '@components/ui/MonacoEditor.vue'
import ToolHeader from '../../../components/layout/ToolHeader.vue'
import BaseButton from '../../../components/ui/BaseButton.vue'
import BaseInput from '../../../components/ui/BaseInput.vue'
import CodeOutputPanel from '../../../components/ui/CodeOutputPanel.vue'

import { usePbacFileSystem } from '../composables/usePbacFileSystem'
import { usePbacUtils, createDefaultCategory, createDefaultPolicy } from '../composables/usePbacUtils'
import { usePbacJsonSync } from '../composables/usePbacJsonSync'
import type { Category, Policy } from '../types'

import PbacTreeItem from '../components/PbacTreeItem.vue'
import PolicyEditor from '../components/PolicyEditor.vue'
import VocabularyManager from '../components/VocabularyManager.vue'
import InteractiveJson from '../components/InteractiveJson.vue'
import { TOOLS } from '../../../config/tools'

// -- Theme & Config --
const tool = TOOLS.find(t => t.id === 'pbac')!

// -- Mobile Sidebar Logic --
const isMobileSidebarOpen = ref(false)
const toggleMobileSidebar = () => isMobileSidebarOpen.value = !isMobileSidebarOpen.value
provide('mobileSidebar', { isOpen: isMobileSidebarOpen, toggle: toggleMobileSidebar })

// -- Logic --
const { items, findItem, updateItem, deleteItem, addItem, addRootItem, toggleCategory, moveItem } = usePbacFileSystem([
    { ...createDefaultCategory("General Access"), children: [createDefaultPolicy()] }
])

const { generateScript, generateGlobalScript } = usePbacUtils()

const selectedId = ref<string>('')
const activeTab = ref<'editor' | 'vocabulary' | 'export' | 'json'>('editor')

// JSON Sync Logic
const { jsonCode, jsonError, handleJsonChange } = usePbacJsonSync(items)

const rightPaneTab = ref<'json' | 'script'>('json') // Local split state
const targetId = ref('targetFolder') // For script generation
const isGenerating = ref(false)
const previewScript = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

// Global Export
const globalScript = ref('')
const handleGenerateGlobal = async () => {
    isGenerating.value = true
    try {
        globalScript.value = await generateGlobalScript(items.value)
    } finally {
        isGenerating.value = false
    }
}

// Watch activeTab to trigger global export
watch(activeTab, (val) => {
    if (val === 'export') handleGenerateGlobal()
})

// Vocabulary State
const vocab = ref({
    roles: ['role:admin', 'role:user'],
    types: ['CeDepartment', 'CeEmployee'],
    properties: ['resource.department', 'resource.owner']
})

// Selection Logic
const selectedItem = computed(() => {
    if (!selectedId.value) return null
    return findItem(selectedId.value)
})

// Auto-select first policy if nothing selected
if (!selectedId.value && items.value.length > 0) {
    const firstCat = items.value[0] as Category
    if (firstCat && firstCat.children && firstCat.children.length > 0) {
        selectedId.value = firstCat.children[0]!.id
    }
}


// Handlers
const handleSelect = (id: string) => selectedId.value = id
const handleToggle = (id: string) => toggleCategory(id)

const handleAddNode = (parentId: string, type: 'Category' | 'Policy') => {
    const newItem = addItem(parentId, type)
    if (newItem && type === 'Policy') selectedId.value = newItem.id
}
const handleAddRoot = (type: 'Category' | 'Policy') => {
    const newItem = addRootItem(type)
    if (newItem && type === 'Policy') selectedId.value = newItem.id
}
const handleDelete = (id: string) => {
    if (confirm('Delete this item?')) {
        deleteItem(id)
        if (selectedId.value === id) selectedId.value = ''
    }
}

const handleRename = (id: string, name: string) => {
    const item = findItem(id)
    if (item) {
        item.name = name
        updateItem(item)
    }
}

const handleMove = (dragId: string, dropId: string, position: 'before' | 'after' | 'inside') => {
    moveItem(dragId, dropId, position)
}

// -- Script & Preview Generation (Optimized: Deferred) --
const updatePreview = async () => {
    if (!selectedItem.value || selectedItem.value.itemType !== 'Policy') return
    
    isGenerating.value = true
    try {
        previewScript.value = await generateScript(selectedItem.value as Policy, targetId.value)
    } finally {
        isGenerating.value = false
    }
}

// Watch for changes deeply to regenerate script/json
watch([selectedItem, targetId], () => {
    if (activeTab.value === 'editor' && rightPaneTab.value === 'script') {
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(updatePreview, 300)
    }
}, { deep: true })

// Urgent update on tab switch
watch(rightPaneTab, (val) => {
    if (val === 'script') updatePreview()
})

// -- Keyboard Navigation Removed --

import { usePbacContextMenu } from '../composables/usePbacContextMenu'

const { renamingId, contextMenu, handleContextMenu, handleRequestRename, handleStopRename, closeContextMenu } = usePbacContextMenu()

// Copy Actions Removed per user request

// Context Menu Actions
const cmAction = (action: 'add-folder' | 'add-policy' | 'rename' | 'delete') => {
    const { itemId } = contextMenu.value
    closeContextMenu()

    switch (action) {
        case 'add-folder':
            handleAddNode(itemId, 'Category')
            break
        case 'add-policy':
            handleAddNode(itemId, 'Policy')
            break
        case 'rename':
            renamingId.value = itemId
            break
        case 'delete':
            handleDelete(itemId)
            break
    }
}
</script>

<template>
    <div class="h-screen flex flex-col bg-layer-01 overflow-hidden" @click="closeContextMenu" @contextmenu="closeContextMenu" :style="{
        '--interactive-01': tool.themeColors.primary,
        '--interactive-01-hover': tool.themeColors.hover,
        '--focus': tool.themeColors.primary
    } as any">
        
        <!-- Top Header (Full Width) -->
        <ToolHeader title="PBAC Architect" :theme="tool.headerTheme">
            <!-- Center Slot: Tool Mode Selector (Like LayoutBuilder) -->
            <template #center>
                <div class="flex items-center divide-x divide-border-subtle border border-border-subtle bg-layer-01 rounded-md overflow-hidden">
                    <button 
                        @click="activeTab = 'editor'" 
                        :class="activeTab === 'editor' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" 
                        class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"
                    >
                        <FileText class="w-3.5 h-3.5" /> Editor
                    </button>
                    <button 
                        @click="activeTab = 'vocabulary'" 
                        :class="activeTab === 'vocabulary' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" 
                        class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"
                    >
                        <Book class="w-3.5 h-3.5" /> Vocabulary
                    </button>
                    <button 
                        @click="activeTab = 'export'" 
                        :class="activeTab === 'export' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" 
                        class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"
                    >
                        <Download class="w-3.5 h-3.5" /> Script
                    </button>
                </div>
            </template>

            <!-- Actions: None -->
            <!-- <template #actions> -->
            <!-- </template> -->
        </ToolHeader>

        <!-- Context Menu -->
        <div v-if="contextMenu.visible" 
             class="fixed bg-layer-02 border border-border-subtle shadow-xl rounded-md py-1 z-50 min-w-[160px] flex flex-col"
             :style="{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }"
        >
            <template v-if="contextMenu.itemType === 'Category'">
                <button @click.stop="cmAction('add-folder')" class="text-left px-4 py-2 hover:bg-layer-03 text-text-primary text-xs flex items-center gap-2">
                    <Folder class="w-3.5 h-3.5 text-text-secondary" /> New Folder
                </button>
                <button @click.stop="cmAction('add-policy')" class="text-left px-4 py-2 hover:bg-layer-03 text-text-primary text-xs flex items-center gap-2">
                    <FileText class="w-3.5 h-3.5 text-text-secondary" /> New Policy
                </button>
                <div class="h-px bg-border-subtle my-1"></div>
            </template>
            <button @click.stop="cmAction('rename')" class="text-left px-4 py-2 hover:bg-layer-03 text-text-primary text-xs">Rename</button>
            <button @click.stop="cmAction('delete')" class="text-left px-4 py-2 hover:bg-red-900/20 text-red-400 text-xs">Delete</button>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 flex overflow-hidden relative">
            
            <!-- Mobile Backdrop -->
            <div v-if="isMobileSidebarOpen" @click="isMobileSidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>

            <!-- Sidebar (Structure) -->
            <aside class="w-64 border-r border-border-subtle flex flex-col bg-layer-01 z-40
                          fixed inset-y-0 left-0 transform transition-transform duration-300 lg:static lg:transform-none lg:shadow-none shadow-xl"
                   :class="isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'">
                
                <!-- Sidebar Header -->
                 <div class="px-4 py-3 border-b border-border-subtle flex justify-between items-center shrink-0 h-10 bg-layer-01">
                    <h3 class="font-bold text-xs uppercase tracking-wider text-text-secondary">Structure</h3>
                    <div class="flex gap-1" v-if="activeTab === 'editor'">
                         <BaseButton size="sm" variant="ghost" class="h-6 px-1" @click="handleAddRoot('Category')" title="New Folder"><Folder class="w-3.5 h-3.5" /></BaseButton>
                         <BaseButton size="sm" variant="ghost" class="h-6 px-1" @click="handleAddRoot('Policy')" title="New Policy"><FileText class="w-3.5 h-3.5" /></BaseButton>
                    </div>
                </div>

                <!-- Sidebar Content -->
                <div class="flex-1 overflow-y-auto py-2 space-y-0.5" v-if="items.length > 0">
                    <PbacTreeItem 
                        v-for="item in items" 
                        :key="item.id" 
                        :item="item" 
                        :level="0" 
                        :selected-id="selectedId" 
                        :renaming-id="renamingId"
                        @select="handleSelect" 
                        @toggle="handleToggle" 
                        @add="handleAddNode"
                        @delete="handleDelete"
                        @rename="handleRename"
                        @move="handleMove"
                        @context-menu="handleContextMenu"
                        @request-rename="handleRequestRename"
                        @stop-rename="handleStopRename"
                    />
                </div>
            </aside>
            
            <!-- Workspace ... (rest of file) -->
            <main class="flex-1 overflow-hidden flex flex-col relative min-w-0 bg-background">
                <!-- ... existing main content ... -->
                <!-- JSON Editor Tab -->
                <div v-if="activeTab === 'json'" class="flex-1 flex flex-col bg-layer-01 relative">
                    <div class="absolute top-2 right-4 z-10 text-xs text-red-400 bg-layer-02 px-2 py-1 rounded border border-red-900/50" v-if="jsonError">
                        Invalid JSON: {{ jsonError }}
                    </div>
                    <MonacoEditor 
                        :model-value="jsonCode"
                        @update:model-value="handleJsonChange"
                        language="json"
                        theme="vs-dark"
                    />
                </div>

                <VocabularyManager 
                    v-else-if="activeTab === 'vocabulary'" 
                    v-model="vocab" 
                />

                <!-- Export Tab -->
                <div v-else-if="activeTab === 'export'" class="flex-1 flex flex-col bg-layer-01">
                    <div class="p-4 border-b border-border-subtle flex justify-between items-center bg-layer-01">
                        <h2 class="text-lg font-light text-text-primary">Complete Extended Script</h2>
                    </div>
                    <div class="flex-1 overflow-hidden relative"> <!-- Removed padding p-4 -->
                         <CodeOutputPanel 
                            :code="globalScript" 
                            language="csharp" 
                            :loading="isGenerating"
                            class="flex-1 h-full border-0 rounded-none" 
                        />
                    </div>
                </div>

                <!-- Editor Tab (Split View) -->
                <template v-else>
                    <template v-if="selectedItem">
                        
                        <!-- Category Editor -->
                        <div v-if="selectedItem.itemType === 'Category'" class="flex-1 flex flex-col items-center justify-center text-text-tertiary">
                            <Folder class="w-12 h-12 mb-4 opacity-50 text-interactive-01" />
                            <BaseInput v-model="selectedItem.name" class="text-center w-64 text-lg" variant="ghost" />
                            <p class="text-xs mt-2">Folder / Spacer</p>
                        </div>

                        <!-- Policy Split View -->
                        <div v-else class="flex h-full">
                            <!-- Left Pane: Visual Editor (50%) -->
                            <div class="w-1/2 border-r border-border-subtle flex flex-col bg-layer-01 overflow-hidden">
                                    <PolicyEditor 
                                    :policy="(selectedItem as Policy)" 
                                    @change="(updated) => updateItem(updated)" 
                                />
                            </div>

                            <!-- Right Pane: Preview (50%) -->
                            <div class="w-1/2 flex flex-col bg-layer-02 overflow-hidden">
                                <!-- Preview Tabs -->
                                <div class="flex border-b border-border-subtle bg-layer-02 px-2 shrink-0 h-10 items-center justify-between">
                                    <div class="flex">
                                        <button @click="rightPaneTab = 'json'" class="px-4 h-10 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors" :class="rightPaneTab === 'json' ? 'border-interactive-01 text-interactive-01' : 'border-transparent text-text-secondary hover:text-text-primary'">Interactive JSON</button>
                                        <button @click="rightPaneTab = 'script'" class="px-4 h-10 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors" :class="rightPaneTab === 'script' ? 'border-interactive-01 text-interactive-01' : 'border-transparent text-text-secondary hover:text-text-primary'">Extended Code</button>
                                    </div>
                                    
                                    <!-- Target ID Input for Script -->
                                    <div v-if="rightPaneTab === 'script'" class="flex items-center gap-3 pr-2">
                                        <span class="text-[10px] text-text-tertiary font-bold uppercase">Target Folder :=</span>
                                        <input v-model="targetId" class="bg-transparent border-b border-border-strong hover:border-interactive-01 focus:border-interactive-01 w-24 text-xs font-mono font-medium focus:outline-none text-text-primary placeholder-text-tertiary transition-colors" placeholder="targetFolder" />
                                    </div>
                                </div>

                                <!-- Right Content -->
                                <div class="flex-1 overflow-hidden relative">
                                    <div v-show="rightPaneTab === 'json'" class="h-full relative overflow-hidden">
                                        <InteractiveJson 
                                            v-if="selectedItem"
                                            :model-value="selectedItem" 
                                            @update:model-value="updateItem($event)"
                                            :vocab="vocab"
                                        />
                                    </div>
                                    <div v-show="rightPaneTab === 'script'" class="h-full flex flex-col">
                                        <CodeOutputPanel 
                                            :code="previewScript" 
                                            language="csharp" 
                                            :loading="isGenerating"
                                            class="flex-1 border-0"
                                        />
                                    </div>
                                </div>
                                
                                <div v-if="rightPaneTab === 'json'" class="p-1.5 bg-layer-02 text-[10px] text-text-tertiary border-t border-border-subtle text-center">
                                    ReadOnly Preview
                                </div>
                            </div>
                        </div>

                    </template>

                    <!-- Empty State -->
                    <div v-else class="flex-1 flex flex-col items-center justify-center text-text-tertiary">
                        <div class="w-16 h-16 rounded-full bg-layer-02 flex items-center justify-center mb-4">
                            <FileText class="w-8 h-8 text-text-disabled" />
                        </div>
                        <h3 class="text-lg font-light text-text-secondary">No Policy Selected</h3>
                        <p class="text-xs mt-2 max-w-[200px] text-center">Select an item from the sidebar or create a new one to get started.</p>
                        <div class="flex gap-2 mt-6">
                            <BaseButton variant="outline" @click="handleAddRoot('Category')">New Folder</BaseButton>
                            <BaseButton variant="solid" @click="handleAddRoot('Policy')">New Policy</BaseButton>
                        </div>
                    </div>
                </template>
            </main>
        </div>
    </div>
</template>
