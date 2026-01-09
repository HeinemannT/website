<script setup lang="ts">
import {
    Activity,
    Image as ImageIcon,
    File,
    Link,
    MousePointer2
} from 'lucide-vue-next'

const props = defineProps<{
    type: string // inventoryId
    instanceName: string
}>()

// Generic Dummy Data for Tables
const tableHeader = ['ID', 'Name', 'Status', 'Date', 'Value']
const tableRows = [
    ['#1024', 'Project Alpha', 'Active', '2023-10-01', '$12,500'],
    ['#1025', 'Project Beta', 'Pending', '2023-11-15', '$8,200'],
    ['#1026', 'Project Gamma', 'Done', '2023-09-01', '$24,000'],
    ['#1027', 'Internal Ops', 'Active', '2023-12-01', '$4,150'],
]
</script>

<template>
    <div class="w-full h-full text-text-primary overflow-hidden relative select-none pointer-events-none">
        
        <!-- RISK CHART (MATRIX) -->
        <template v-if="type === 'RiskChart'">
            <div class="w-full h-full p-4 flex flex-col">
                <div class="flex-1 grid grid-cols-3 grid-rows-3 gap-0.5 border border-border-strong bg-layer-02">
                     <div class="bg-green-100 dark:bg-green-900/30"></div>
                     <div class="bg-yellow-100 dark:bg-yellow-900/30"></div>
                     <div class="bg-red-100 dark:bg-red-900/30 relative">
                         <div class="absolute inset-0 m-auto w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
                     </div>
                     <div class="bg-green-100 dark:bg-green-900/30"></div>
                     <div class="bg-yellow-100 dark:bg-yellow-900/30 relative">
                          <div class="absolute inset-0 m-auto w-3 h-3 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                     </div>
                     <div class="bg-yellow-100 dark:bg-yellow-900/30"></div>
                     <div class="bg-green-100 dark:bg-green-900/30 relative">
                          <div class="absolute inset-0 m-auto w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                     </div>
                     <div class="bg-green-100 dark:bg-green-900/30"></div>
                     <div class="bg-green-100 dark:bg-green-900/30"></div>
                </div>
            </div>
        </template>

        <!-- CHARTS (Defaut Colorful) -->
        <template v-else-if="type.includes('Chart')">
            <div class="w-full h-full p-2 flex flex-col gap-1">
                <div class="flex items-end justify-between flex-1 gap-1 pb-2 border-b border-border-strong relative">
                    <!-- Y Axis Lines -->
                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
                        <div v-for="i in 3" :key="i" class="w-full h-px bg-border-subtle/50"></div>
                    </div>
                    <!-- Bars (Colorful) -->
                    <div class="w-full bg-[#3b82f6] h-[60%] rounded-t-sm z-10 mx-0.5 opacity-90"></div>
                    <div class="w-full bg-[#8b5cf6] h-[85%] rounded-t-sm z-10 mx-0.5 opacity-90"></div>
                    <div class="w-full bg-[#ec4899] h-[45%] rounded-t-sm z-10 mx-0.5 opacity-90"></div>
                    <div class="w-full bg-[#10b981] h-[90%] rounded-t-sm z-10 mx-0.5 opacity-90"></div>
                    <div class="w-full bg-[#f59e0b] h-[75%] rounded-t-sm z-10 mx-0.5 opacity-90"></div>
                </div>
                 <div class="flex justify-center gap-2 text-[8px] text-text-secondary overflow-hidden whitespace-nowrap">
                    <div class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div> A</div>
                    <div class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></div> B</div>
                     <div class="flex items-center gap-1"><div class="w-1.5 h-1.5 rounded-full bg-[#ec4899]"></div> C</div>
                </div>
            </div>
        </template>


        <!-- TABLES -->
        <template v-else-if="type.includes('Table') || type === 'LocalComments'">
            <div class="w-full h-full flex flex-col overflow-hidden bg-layer-01 text-xs">
                <!-- Grid -->
                <div class="w-full">
                    <div class="grid grid-cols-5 border-b border-border-subtle bg-layer-02 font-semibold text-text-primary">
                        <div v-for="h in tableHeader" :key="h" class="p-2 border-r border-border-subtle last:border-r-0">{{ h }}</div>
                    </div>
                    <div v-for="(row, idx) in tableRows" :key="idx" class="grid grid-cols-5 border-b border-border-subtle hover:bg-layer-02/50 text-text-secondary">
                        <div v-for="(cell, cIdx) in row" :key="cIdx" class="p-2 border-r border-border-subtle last:border-r-0 truncate">{{ cell }}</div>
                    </div>
                   <div class="grid grid-cols-5 border-b border-border-subtle hover:bg-layer-02/50 text-text-secondary">
                        <div class="p-2 border-r border-border-subtle bg-layer-03/20">&nbsp;</div>
                        <div class="p-2 border-r border-border-subtle">&nbsp;</div>
                   </div>
                </div>
            </div>
        </template>

        <!-- INPUTS / BUTTONS -->
        <template v-else-if="type === 'ActionButton'">
             <div class="w-full h-full p-2">
                <button class="w-full h-full bg-interactive-01 text-white rounded-sm shadow-sm font-medium flex items-center justify-center gap-2 hover:bg-interactive-hover transition-colors">
                    <MousePointer2 class="w-4 h-4" /> {{ instanceName }}
                </button>
             </div>
        </template>
        
        <!-- TEXT (Lorem Ipsum) -->
        <template v-else-if="type.includes('Text')">
             <div class="w-full h-full p-3 flex flex-col gap-2">
                 <h4 class="text-sm font-bold text-text-primary">Header Text</h4>
                 <p class="text-xs text-text-primary leading-relaxed">
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                 </p>
                 <div class="space-y-1 opacity-50">
                      <div class="h-2 w-full bg-text-secondary/10 rounded"></div>
                      <div class="h-2 w-2/3 bg-text-secondary/10 rounded"></div>
                 </div>
             </div>
        </template>
        
        <!-- INPUT VIEW -->
        <template v-else-if="type === 'InputView'">
            <div class="w-full h-full p-6 flex flex-col gap-4">
                <div class="space-y-1">
                    <div class="h-3 w-24 bg-text-secondary/20 rounded"></div>
                    <div class="h-8 w-full border border-border-strong rounded bg-white dark:bg-layer-02 flex items-center px-3 text-text-secondary">
                        Input value...
                    </div>
                </div>
            </div>
        </template>

        <!-- IMAGE/PDF -->
        <template v-else-if="type === 'ImageView' || type === 'PdfView' || type === 'URLView'">
            <div class="w-full h-full bg-layer-03 flex items-center justify-center relative overflow-hidden">
                <ImageIcon v-if="type === 'ImageView'" class="w-16 h-16 text-text-disabled/50" />
                <File v-else-if="type === 'PdfView'" class="w-16 h-16 text-text-disabled/50" />
                <Link v-else class="w-16 h-16 text-text-disabled/50" />
                
                <div class="absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent"></div>
                <div class="absolute bottom-4 left-4 text-xs font-mono text-text-secondary">{{ type }} Component</div>
            </div>
        </template>
        
        <!-- DEFAULT FALLBACK -->
        <template v-else>
             <div class="w-full h-full flex items-center justify-center bg-layer-02/30">
                 <div class="flex flex-col items-center gap-2 text-text-disabled">
                    <Activity class="w-8 h-8 opacity-20" />
                    <span class="text-xs opacity-50">{{ type }}</span>
                 </div>
             </div>
        </template>

    </div>
</template>
