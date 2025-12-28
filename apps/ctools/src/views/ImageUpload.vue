<script setup lang="ts">
import { ref, computed } from 'vue'
import { Trash2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-vue-next'
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
            realItem.blob = blob
            realItem.previewUrl = URL.createObjectURL(blob)
            realItem.mimeType = blob.type
            realItem.sizeLabel = (blob.size / 1024).toFixed(1) + ' KB'
            
            // Trigger processing immediately
            await processItemContent(realItem)
            
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
            file,
            name: baseName,
            scriptId: '', // Default to empty
            status: 'pending',
            previewUrl: URL.createObjectURL(file), 
            mimeType: file.type || 'image/png',
            sizeLabel: (file.size / 1024).toFixed(1) + ' KB'
        }
        
        items.value.push(newItem)
        
        // Fix: Retrieve the reactive proxy from the array to ensure deep reactivity triggers
        const reactiveItem = items.value.find(i => i.id === newItem.id)
        if (reactiveItem) {
            await processItemContent(reactiveItem)
        }
    })

    if (fileArray.length === 0 && (files instanceof FileList ? files.length > 0 : files.length > 0)) {
        toast('No image files found in selection', 'info')
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
const scriptOutput = computed(() => {
    // Check if any done items exist
    const readyItems = items.value.filter(i => i.status === 'done')
    if (readyItems.length === 0) return ''

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

    return sb.toString()
})

const isAnyProcessing = computed(() => items.value.some(i => i.status === 'processing' || i.status === 'pending'))

</script>

<template>
    <ToolLayout sidebarClass="w-full md:w-1/3">
        <template #main>
             <div class="flex flex-col h-full overflow-hidden">
                <ToolHeader title="Image Upload" :icon="ImageIcon" icon-color="text-violet-600 dark:text-violet-400" />
                
                <div class="p-6 overflow-y-auto">
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <!-- Left: Drop Zone -->
                        <div class="lg:col-span-2">
                             <FileDropZone 
                                @drop="handleFiles" 
                                class="h-full min-h-[200px] border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl transition-all group cursor-pointer" 
                                accept="image/*"
                            >
                                <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                                    <div class="mb-4 p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 group-hover:scale-110 transition-transform">
                                         <ImageIcon class="w-8 h-8" />
                                    </div>
                                    <p class="mb-2 text-sm text-slate-500 dark:text-slate-400"><span class="font-bold text-indigo-500">Click to upload</span> or drag and drop</p>
                                    <p class="text-xs text-slate-400 dark:text-slate-500">SVG, PNG, JPG or GIF (MAX. 10MB)</p>
                                </div>
                            </FileDropZone>
                        </div>

                        <!-- Right: Smart Controls -->
                        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm flex flex-col gap-4">
                            <!-- Target Variable -->
                            <div>
                                <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Target Variable</label>
                                <div class="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                                    <span class="text-indigo-500 font-mono text-xs mr-2">:=</span>
                                    <input v-model="folderName" type="text" spellcheck="false" class="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none w-full" />
                                </div>
                            </div>

                            <!-- Smart Import -->
                            <div class="flex-1 flex flex-col">
                                <div class="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-3">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">Bulk Import</span>
                                    <span class="text-indigo-400 text-xs normal-case">Paste URLs (one per line)</span>
                                </div>
                                <textarea v-model="bulkUrls" rows="3" 
                                    class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs font-mono resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none mb-3"
                                    placeholder="https://example.com/image.png&#10;https://othersite.com/logo.svg" 
                                ></textarea>
                                
                                <div class="flex gap-2">
                                     <button @click="importFromUrl" :disabled="!bulkUrls" class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                                         Fetch Images
                                     </button>
                                     <button @click="clearAll" v-if="items.length" class="px-3 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-colors">
                                         <Trash2 class="w-4 h-4" />
                                     </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>

                    <!-- Staging List -->
                    <div class="space-y-3">
                        <div v-if="items.length === 0" class="text-center py-12 text-slate-400 dark:text-slate-600 italic">
                            Images to process will appear here...
                        </div>
                        
                        <div v-for="item in items" :key="item.id" 
                            class="group flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:border-indigo-300 dark:hover:border-indigo-700">
                            
                            <!-- Preview -->
                            <div class="w-16 h-16 shrink-0 bg-slate-100 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center">
                                <img v-if="item.previewUrl" :src="item.previewUrl" class="w-full h-full object-cover" />
                                <ImageIcon v-else class="w-6 h-6 text-slate-400" />
                            </div>

                            <!-- Metadata Inputs -->
                            <div class="flex-grow min-w-0 grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">ID</label>
                                    <input v-model="item.scriptId" class="w-full text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:border-indigo-500 outline-none" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Resource Name</label>
                                    <input v-model="item.name" class="w-full text-xs font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 focus:border-indigo-500 outline-none" />
                                </div>
                            </div>

                            <!-- Status / Actions -->
                            <div class="flex flex-col items-end gap-2 shrink-0">
                                <div v-if="item.status === 'done'" class="text-emerald-500 flex items-center text-xs font-bold"><CheckCircle class="w-3 h-3 mr-1" /> DONE</div>
                                <div v-else-if="item.status === 'error'" class="text-pink-500 flex items-center text-xs font-bold"><AlertCircle class="w-3 h-3 mr-1" /> ERROR</div>
                                <div v-else-if="item.status === 'processing'" class="text-indigo-500 text-xs font-bold animate-pulse">PROCESSING...</div>
                                <div v-else class="text-slate-400 text-xs font-medium">{{ item.sizeLabel }}</div>

                                <button @click="removeItem(item.id)" class="text-slate-400 hover:text-pink-500 p-1 rounded hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors">
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
