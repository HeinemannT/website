<script setup lang="ts">
import { ref, computed, markRaw, shallowRef, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { Trash2, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-vue-next'
import FileDropZone from '../components/ui/FileDropZone.vue'

import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
import ToolHeader from '../components/layout/ToolHeader.vue'
import { useToast } from '../composables/useToast'
import { gzipAndBase64Async, chunkString } from '../utils/gzip'
import { ScriptBuilder } from '../utils/ScriptBuilder'

const { add: toast } = useToast()

interface ImageItem {
    id: string
    file?: File
    blob?: Blob     // For URL fetched images
    url?: string
    name: string
    scriptId: string
    status: 'pending' | 'processing' | 'done' | 'error'
    previewUrl?: string
    mimeType: string
    sizeLabel: string
    // contentString removed: stored in non-reactive cache
}

const items = ref<ImageItem[]>([])
const folderName = ref('vFolder')
const bulkUrls = ref('') 

const PROXY_TEMPLATES = [
    (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://thingproxy.freeboard.io/fetch/${url}`
]

const fetchBlobWithRetry = async (url: string) => {
    for (const template of PROXY_TEMPLATES) {
        const proxyUrl = template(url)
        try {
            const res = await fetch(proxyUrl)
            if (!res.ok) continue
            const blob = await res.blob()
            if (blob.size > 0 && blob.type.startsWith('image/')) return blob
        } catch (e) {
            console.warn(`Proxy failed: ${proxyUrl}`, e)
        }
    }
    throw new Error('All proxies failed')
}

// Optimization: Store heavy content outside Vue reactivity system
const contentCache = new Map<string, string>()

// Prepare item content in background (Heavy lifting)
const processItemContent = async (item: ImageItem) => {
    try {
        item.status = 'processing'
        let data: Uint8Array
        
        if (item.file) {
            data = new Uint8Array(await item.file.arrayBuffer())
        } else if (item.blob) {
            data = new Uint8Array(await item.blob.arrayBuffer())
        } else {
            throw new Error('No data')
        }

        // Compress and encode
        const base64 = await gzipAndBase64Async(data)
        const chunked = chunkString(base64)
        
        // Store in non-reactive cache
        const contentStr = `${item.name};${item.mimeType};${chunked}`
        contentCache.set(item.id, contentStr)
        
        item.status = 'done'

    } catch (e) {
        console.error('Processing failed for', item.name, e)
        item.status = 'error'
    }
}

const createItem = (id: string, url: string, baseName: string): ImageItem => {
    const item: ImageItem = {
        id,
        url,
        name: baseName,
        scriptId: '', // Default to empty as requested
        status: 'pending',
        mimeType: 'image/png',
        sizeLabel: 'Fetching...'
    }
    return item
}

const importFromUrl = async () => {
    if (!bulkUrls.value) return
    
    // Parse Lines
    const rawLines = bulkUrls.value.trim().split(/\r?\n/).filter(line => line.trim() !== '')
    const uniqueUrls = [...new Set(rawLines.map(l => l.trim()))]
    
    if (uniqueUrls.length === 0) return

    toast(`Fetching ${uniqueUrls.length} image(s)...`, 'info')
    
    // Create placeholders first (optimistic UI)
    const newItems: ImageItem[] = uniqueUrls.map(url => {
        const lastSegment = url.split('/').pop() ?? 'image'
        const namePart = lastSegment.split('?')[0] ?? 'image'
        const baseName = (namePart.split('.')[0] ?? 'image').replace(/[^a-zA-Z0-9_-]/g, '_')
        const id = crypto.randomUUID()
        return createItem(id, url, baseName)
    })

    // Add to list immediately
    items.value.push(...newItems)
    bulkUrls.value = ''

    // Process in background
    let success = 0
    let fail = 0

    // Use Promise.allSettled to handle all requests without failing early
    await Promise.allSettled(newItems.map(async (item) => {
        const realItem = items.value.find(i => i.id === item.id)
        if (!realItem) return

        try {
            const blob = await fetchBlobWithRetry(item.url!)
            realItem.blob = markRaw(blob) // Optimization: Don't proxy heavy Blobs
            realItem.previewUrl = URL.createObjectURL(blob)
            realItem.mimeType = blob.type
            realItem.sizeLabel = (blob.size / 1024).toFixed(1) + ' KB'
            
            // Trigger processing via queue
            queueItem(realItem)
            
            if (realItem.status === 'done') success++
            else fail++
        } catch (e) {
            realItem.status = 'error'
            realItem.sizeLabel = 'Failed'
            fail++
        }
    }))

    if (success > 0) toast(`Imported ${success} images`, 'success')
    if (fail > 0) toast(`Failed to import ${fail} images`, 'error')
}

const handleFiles = (files: File[] | FileList) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    
    fileArray.forEach(async (file) => {
        if (!file) return
        const parts = file.name.split('.')
        const namePart = parts[0] || 'image'
        const baseName = namePart.replace(/[^a-zA-Z0-9_-]/g, '_')
        
        const newItem: ImageItem = {
            id: crypto.randomUUID(),
            file: markRaw(file), // Optimization: Don't proxy heavy File objects
            name: baseName,
            scriptId: '', 
            status: 'pending',
            previewUrl: URL.createObjectURL(file), 
            mimeType: file.type || 'image/png',
            sizeLabel: (file.size / 1024).toFixed(1) + ' KB'
        }
        
        items.value.push(newItem)
        queueItem(newItem)
    })

    if (fileArray.length === 0 && (files instanceof FileList ? files.length > 0 : files.length > 0)) {
        toast('No image files found in selection', 'info')
    }
}

// --- Concurrency Queue ---
const processingQueue = ref<ImageItem[]>([])
const activeProcessing = ref(0)
const MAX_CONCURRENT = 2

const queueItem = (item: ImageItem) => {
    processingQueue.value.push(item)
    processNext()
}

const processNext = async () => {
    if (activeProcessing.value >= MAX_CONCURRENT) return
    if (processingQueue.value.length === 0) return

    const item = processingQueue.value.shift()
    if (!item) return

    activeProcessing.value++
    // Yield to UI thread to allow render updates
    await new Promise(r => setTimeout(r, 16)) 

    try {
        await processItemContent(item)
    } finally {
        activeProcessing.value--
        processNext()
    }
}

const removeItem = (id: string) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
        contentCache.delete(id) // Clear cache
        const idx = items.value.indexOf(item)
        items.value.splice(idx, 1)
    }
}

const clearAll = () => {
    items.value.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl) })
    items.value = []
    contentCache.clear() // Clear all cache
}



// Reactive Script Generation
// Reactive Script Generation
const scriptOutput = shallowRef('')

const generateScript = () => {
    // Check if any done items exist
    const readyItems = items.value.filter(i => i.status === 'done')
    if (readyItems.length === 0) {
        scriptOutput.value = ''
        return
    }

    const sb = new ScriptBuilder(`Image Upload Script (${readyItems.length} files)`)
    
    for (const item of readyItems) {
        // Retrieve content from non-reactive cache
        const content = contentCache.get(item.id)
        if (!content) continue

        // ScriptBuilder handles stripping empty ID automatically
        sb.createObject(folderName.value, 'FileResource', {
            id: item.scriptId,
            name: item.name,
            content: content
        })
    }

    scriptOutput.value = sb.toString()
}

// Debounce updates
const debouncedGenerate = useDebounceFn(generateScript, 500)

watch([items, folderName], () => debouncedGenerate(), { deep: true })

const isAnyProcessing = computed(() => items.value.some(i => i.status === 'processing' || i.status === 'pending'))

import { TOOLS } from '../config/tools'
const tool = TOOLS.find(t => t.id === 'image')!
</script>

<template>
    <ToolLayout sidebarClass="w-full md:w-1/3">
        <template #main>
             <div class="flex flex-col h-full overflow-hidden">
                <ToolHeader title="Image Upload" :theme="tool.headerTheme" />
                
                <div class="p-6 overflow-y-auto">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <!-- Left: Drop Zone -->
                        <div class="lg:col-span-2">
                            <FileDropZone 
                                @drop="handleFiles" 
                                class="h-full min-h-[200px] border-2 border-dashed border-border-strong hover:border-interactive-01 bg-layer-02 rounded-none transition-all group cursor-pointer" 
                                accept="image/*"
                            >
                                <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <div class="mb-4 p-4 rounded-none bg-layer-01 text-interactive-01 group-hover:scale-110 transition-transform">
                                         <ImageIcon class="w-8 h-8" />
                                    </div>
                                    <p class="mb-2 text-sm text-text-secondary"><span class="font-bold text-interactive-01">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-text-secondary">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                                </div>
                            </FileDropZone>
                        </div>

                        <!-- Right: Smart Controls -->
                        <div class="bg-layer-01 rounded-none border border-border-subtle p-5 shadow-none flex flex-col gap-4">
                            <!-- Target Variable -->
                            <div>
                                <label class="text-[10px] uppercase font-bold text-text-secondary tracking-wider mb-2 block">Target Variable</label>
                                <div class="flex items-center bg-layer-02 border border-border-strong rounded-none px-3 py-2">
                                    <span class="text-interactive-01 font-mono text-xs mr-2">:=</span>
                                    <input v-model="folderName" type="text" spellcheck="false" class="bg-transparent border-none text-sm font-bold text-text-primary focus:outline-none w-full" />
                                </div>
                            </div>

                            <!-- Smart Import -->
                            <div class="flex-1 flex flex-col">
                                <div class="bg-layer-02 border border-border-strong rounded-none p-3">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-interactive-01 font-bold text-xs uppercase tracking-wider">Bulk Import</span>
                                    <span class="text-text-secondary text-xs normal-case">Paste URLs (one per line)</span>
                                </div>
                                <textarea v-model="bulkUrls" rows="3" 
                                    class="w-full bg-layer-01 border border-border-strong rounded-none p-3 text-xs font-mono resize-none focus:ring-1 focus:ring-interactive-01 focus:border-interactive-01 outline-none mb-3 text-text-primary"
                                    placeholder="https://example.com/image.png&#10;https://othersite.com/logo.svg" 
                                ></textarea>
                                
                                <div class="flex gap-2">
                                     <button @click="importFromUrl" :disabled="!bulkUrls" class="flex-1 bg-interactive-01 hover:bg-interactive-01-hover disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded-none transition-colors shadow-none">
                                         Fetch Images
                                     </button>
                                     <button @click="clearAll" v-if="items.length" class="px-3 bg-red-600/10 hover:bg-red-600/20 text-red-600 hover:text-red-700 rounded-none transition-colors">
                                         <Trash2 class="w-4 h-4" />
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- Staging List -->
                    <div class="space-y-3">
                        <div v-if="items.length === 0" class="text-center py-12 text-text-secondary italic">
                            Images to process will appear here...
                        </div>
                        
                        <div v-for="item in items" :key="item.id" 
                            class="group flex items-center gap-4 p-3 bg-layer-01 rounded-none border border-border-subtle shadow-none transition-all hover:border-interactive-01">
                            
                            <!-- Preview -->
                            <div class="w-16 h-16 shrink-0 bg-layer-02 rounded-none border border-border-subtle overflow-hidden flex items-center justify-center">
                                <img v-if="item.previewUrl" :src="item.previewUrl" class="w-full h-full object-cover" />
                                <ImageIcon v-else class="w-6 h-6 text-text-secondary" />
                            </div>

                            <!-- Metadata Inputs -->
                            <div class="flex-grow min-w-0 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[10px] font-bold text-text-secondary uppercase mb-0.5">ID</label>
                                    <input v-model="item.scriptId" class="w-full text-xs font-mono bg-layer-02 border border-border-strong rounded-none px-2 py-1 focus:border-interactive-01 outline-none text-text-primary" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-text-secondary uppercase mb-0.5">Resource Name</label>
                                    <input v-model="item.name" class="w-full text-xs font-mono bg-layer-02 border border-border-strong rounded-none px-2 py-1 focus:border-interactive-01 outline-none text-text-primary" />
                                </div>
                            </div>

                            <!-- Status / Actions -->
                            <div class="flex flex-col items-end gap-2 shrink-0">
                                <div v-if="item.status === 'done'" class="text-green-500 flex items-center text-xs font-bold"><CheckCircle class="w-3 h-3 mr-1" /> DONE</div>
                                <div v-else-if="item.status === 'error'" class="text-red-500 flex items-center text-xs font-bold"><AlertCircle class="w-3 h-3 mr-1" /> ERROR</div>
                                <div v-else-if="item.status === 'processing'" class="text-interactive-01 text-xs font-bold animate-pulse">PROCESSING...</div>
                                <div v-else class="text-text-secondary text-xs font-medium">{{ item.sizeLabel }}</div>

                                <button @click="removeItem(item.id)" class="text-text-secondary hover:text-red-600 p-1 rounded-none hover:bg-layer-02 transition-colors">
                                    <Trash2 class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 text-center text-xs text-slate-400" v-if="isAnyProcessing">
                        <span class="animate-pulse">Processing images...</span>
                    </div>

                </div>
             </div>
        </template>
        <template #sidebar>
            <CodeOutputPanel title="Extended Code" :code="scriptOutput" />
        </template>
    </ToolLayout>
</template>
