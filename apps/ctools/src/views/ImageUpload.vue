<script setup lang="ts">
import { ref } from 'vue'
import { Trash2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-vue-next'
import FileDropZone from '../components/ui/FileDropZone.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
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
}

const items = ref<ImageItem[]>([])
const folderName = ref('vFolder')
const urlInput = ref('')
const isProcessing = ref(false)
const generatedScript = ref('')

const fetchBlobWithRetry = async (url: string) => {
    const strategies = [
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        `https://thingproxy.freeboard.io/fetch/${url}`
    ]

    for (const proxyUrl of strategies) {
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

const importFromUrl = async () => {
    if (!urlInput.value) return
    
    // Parse Lines
    const rawLines = urlInput.value.trim().split(/\r?\n/).filter(line => line.trim() !== '')
    const uniqueUrls = [...new Set(rawLines.map(l => l.trim()))]
    
    if (uniqueUrls.length === 0) return

    toast(`Fetching ${uniqueUrls.length} image(s)...`, 'info')
    
    // Create placeholders first (optimistic UI)
    const newItems = uniqueUrls.map(url => {
        const lastSegment = url.split('/').pop() ?? 'image'
        const namePart = lastSegment.split('?')[0]
        const baseName = namePart.split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '_')
        const id = crypto.randomUUID()
        
        return {
            id,
            url,
            name: baseName,
            scriptId: `img_${baseName}`,
            status: 'processing' as const, // Start as processing
            mimeType: 'image/png',
            sizeLabel: 'Fetching...'
        }
    })

    // Add to list immediately
    items.value.push(...newItems as any)
    urlInput.value = ''

    // Process in background
    let success = 0
    let fail = 0

    // Concurrency limit could be added here, but for now Promise.all is okay for small batches
    await Promise.all(newItems.map(async (item) => {
        const realItem = items.value.find(i => i.id === item.id)
        if (!realItem) return

        try {
            const blob = await fetchBlobWithRetry(item.url)
            realItem.blob = blob
            realItem.previewUrl = URL.createObjectURL(blob)
            realItem.mimeType = blob.type
            realItem.sizeLabel = (blob.size / 1024).toFixed(1) + ' KB'
            realItem.status = 'pending' // Ready for generation
            success++
        } catch (e) {
            realItem.status = 'error'
            realItem.sizeLabel = 'Failed'
            fail++
        }
    }))

    if (success > 0) toast(`Successfully imported ${success} images`, 'success')
    if (fail > 0) toast(`Failed to import ${fail} images`, 'error')
}

const handleFiles = (files: File[] | FileList) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'))
    
    fileArray.forEach(file => {
        if (!file) return
        const parts = file.name.split('.')
        const namePart = parts[0] || 'image'
        const baseName = namePart.replace(/[^a-zA-Z0-9_-]/g, '_')
        items.value.push({
            id: crypto.randomUUID(),
            file,
            name: baseName,
            scriptId: `img_${baseName}`,
            status: 'pending',
            previewUrl: URL.createObjectURL(file), 
            mimeType: file.type || 'image/png',
            sizeLabel: (file.size / 1024).toFixed(1) + ' KB'
        })
    })

    if (fileArray.length === 0 && (files instanceof FileList ? files.length > 0 : files.length > 0)) {
        toast('No image files found in selection', 'info')
    }
}

const removeItem = (id: string) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
        const idx = items.value.indexOf(item)
        items.value.splice(idx, 1)
    }
}

const clearAll = () => {
    items.value.forEach(i => { if (i.previewUrl) URL.revokeObjectURL(i.previewUrl) })
    items.value = []
    generatedScript.value = ''
}

const processImages = async () => {
    isProcessing.value = true
    generatedScript.value = ''
    let successCount = 0
    
    const sb = new ScriptBuilder(`Image Upload Script (${items.value.length} files)`)

    for (const item of items.value) {
        if (item.status === 'done') continue

        item.status = 'processing'
        try {
            let data: Uint8Array
            
            if (item.file) {
                const buffer = await item.file.arrayBuffer()
                data = new Uint8Array(buffer)
            } else if (item.blob) {
                const buffer = await item.blob.arrayBuffer()
                data = new Uint8Array(buffer)
            } else {
                throw new Error('No data found for item')
            }

            const base64 = await gzipAndBase64Async(data)
// ... existing code ...
            const chunked = chunkString(base64)
            const contentString = `${item.name};${item.mimeType};${chunked}`
            
            sb.callMethod(folderName.value, 'add', {
                type: 'FileResource',
                id: item.scriptId,
                name: item.name,
                content: contentString
            })
            sb.addNewLine()

            item.status = 'done'
            successCount++
        } catch (err) {
            console.error(err)
            item.status = 'error'
            sb.addComment(`ERROR processing ${item.name}: ${err}`)
        }
    }

    generatedScript.value = sb.toString()
    isProcessing.value = false
    
    if (successCount > 0) {
        toast(`Generated scripts for ${successCount} images`, 'success')
    } else {
        toast('No images successfully processed', 'error')
    }
}
</script>

<template>
    <ToolLayout sidebarClass="w-full md:w-1/3">
        <template #main>
             <div class="flex flex-col h-full bg-grid-pattern overflow-hidden">
                <div class="p-6 overflow-y-auto">
                    <h2 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 mb-6">Image Upload</h2>
                    
                    <FileDropZone @drop="handleFiles" class="mb-6 h-48" accept="image/*" description="Drag images here" />

                    <!-- Configuration -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 mb-6 flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <span class="text-sm font-semibold text-slate-500">Target Folder Variable:</span>
                            <input v-model="folderName" type="text" autocomplete="off" spellcheck="false" class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-48" />
                        </div>
                        
                        <div class="flex items-center gap-2">
                             <input v-model="urlInput" @keyup.enter="importFromUrl" placeholder="Import from URL..." class="bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-3 py-1 text-sm w-64 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
                             <button @click="importFromUrl" :disabled="!urlInput" class="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50">Fetch</button>
                             <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                             <button @click="clearAll" v-if="items.length" class="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">Clear All</button>
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
                                    <label class="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Script ID</label>
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

                    <BaseButton v-if="items.length" @click="processImages" :disabled="isProcessing" class="mt-6 w-full py-4 text-base shadow-lg shadow-indigo-500/20">
                        <span v-if="isProcessing">Processing...</span>
                        <span v-else>Generate Script Block</span>
                    </BaseButton>
                </div>
             </div>
        </template>
        <template #sidebar>
            <CodeOutputPanel title="Output Script" :code="generatedScript" />
        </template>
    </ToolLayout>
</template>
