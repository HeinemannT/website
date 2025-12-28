<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { 
    Folder, Trash2, Plus, X, Minimize2, Maximize2, 
    Monitor, Smartphone, Layout, Layers,
    HelpCircle, GripVertical, LayoutTemplate
} from 'lucide-vue-next'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import ToolLayout from '../components/layout/ToolLayout.vue'
import ToolHeader from '../components/layout/ToolHeader.vue'
import { useLayoutBuilder } from '../composables/useLayoutBuilder'

const {
    // State
    rootParentId,
    mobileStrategy,
    data,
    
    // Actions
    addTabSet,
    addTab,
    addRow,
    addCol,
    
    removeTabSet,
    removeTab,
    removeRow,
    removeCol,
    
    resizeCol,
    
    // Output
    scriptOutput,
    init
} = useLayoutBuilder()

const showMobileHelp = ref(false)

// Initialize
init()

</script>

<template>
    <ToolLayout sidebarClass="w-full lg:w-80">
        
        <!-- Main Canvas -->
        <template #main>
            <!-- Standard Tool Header -->
            <ToolHeader title="Layout Builder" :icon="LayoutTemplate" icon-color="text-indigo-600 dark:text-indigo-400">
                <template #center>
                    <div class="hidden lg:flex items-center gap-6">
                        <div class="flex flex-col relative">
                             <div class="flex items-center gap-1 mb-1">
                                 <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mobile Strategy</label>
                                 <button @click="showMobileHelp = !showMobileHelp" class="text-slate-400 hover:text-indigo-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-0.5"><HelpCircle class="w-3 h-3" /></button>
                                 
                                 <div v-if="showMobileHelp" class="absolute top-0 left-full ml-2 w-64 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 text-xs">
                                     <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">Strategy Guide</h4>
                                     <ul class="space-y-2 text-slate-500">
                                         <li><strong class="text-indigo-500">Mirror:</strong> Mobile layout exactly matches desktop widths.</li>
                                         <li><strong class="text-indigo-500">Stack:</strong> All items become full width (12 cols) on mobile.</li>
                                         <li><strong class="text-indigo-500">Grid:</strong> Items smaller than 50% become 50% width, others full width.</li>
                                     </ul>
                                     <button @click="showMobileHelp = false" class="mt-3 text-[10px] font-bold text-slate-400 hover:text-slate-600 underline">Close</button>
                                 </div>
                             </div>
                             <div class="flex items-center gap-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 rounded p-1">
                                 <button @click="mobileStrategy = 'mirror'" :class="mobileStrategy === 'mirror' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-400'" class="px-3 py-1 rounded transition-colors flex items-center gap-1"><Monitor class="w-3 h-3" /> Mirror</button>
                                 <button @click="mobileStrategy = 'stack'" :class="mobileStrategy === 'stack' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-400'" class="px-3 py-1 rounded transition-colors flex items-center gap-1"><Smartphone class="w-3 h-3" /> Stack</button>
                                 <button @click="mobileStrategy = 'grid'" :class="mobileStrategy === 'grid' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-400'" class="px-3 py-1 rounded transition-colors flex items-center gap-1"><Layout class="w-3 h-3" /> Grid</button>
                             </div>
                        </div>
                    </div>
                </template>

                <template #actions>
                    <div class="flex items-center gap-3">
                         <span class="text-xs font-bold text-slate-400 uppercase">Context: t.</span>
                         <input v-model="rootParentId" class="bg-transparent border-b border-slate-300 dark:border-slate-700 w-32 text-xs font-mono font-medium focus:outline-none focus:border-indigo-500" />
                    </div>
                </template>
            </ToolHeader>

            <!-- Navbar Sub-header for tool settings (Mobile only backup) -->
            <div class="md:hidden border-b border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 overflow-x-auto whitespace-nowrap">
                 <!-- Mobile View Controls -->
            </div>

            <!-- Scrollable Workspace -->
            <div class="flex-1 overflow-y-auto p-8 pb-32 space-y-8">
                
                <draggable 
                    v-model="data" 
                    item-key="id"
                    handle=".ts-handle"
                    class="space-y-8"
                >
                    <template #item="{ element: ts, index: tsIdx }">
                        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden ring-1 ring-black/5 transition-all">
                            
                            <!-- TabSet Header -->
                            <div class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center group/ts">
                                <div class="flex items-center gap-3">
                                    <div class="ts-handle cursor-move text-slate-300 hover:text-slate-500"><GripVertical class="w-4 h-4" /></div>
                                    <Folder class="w-4 h-4 text-indigo-500" />
                                    <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">TabSet</span>
                                    <input v-model="ts.name" class="bg-transparent text-sm font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded px-2 -ml-2 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors" />
                                </div>
                                <button @click="removeTabSet(tsIdx)" class="text-slate-300 hover:text-red-500 opacity-0 group-hover/ts:opacity-100 transition-opacity"><Trash2 class="w-4 h-4" /></button>
                            </div>

                            <!-- Tabs Container -->
                            <div class="p-6 bg-slate-50/50 dark:bg-slate-900/30">
                                <!-- Custom Tab Nav (Draggable) -->
                                <draggable 
                                    v-model="ts.children" 
                                    item-key="id" 
                                    class="flex flex-wrap border-b border-slate-200 dark:border-slate-700 gap-1 mb-6"
                                    handle=".tab-handle"
                                >
                                    <template #item="{ element: tab, index: tIdx }">
                                        <div class="relative group/tabbtn px-4 py-2 bg-white dark:bg-slate-800 rounded-t-lg border-t border-x border-slate-200 dark:border-slate-700 -mb-px flex items-center gap-2 shadow-sm">
                                            <div class="tab-handle cursor-move text-slate-300 hover:text-slate-500 -ml-1"><GripVertical class="w-3 h-3" /></div>
                                            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ tab.name }}</span>
                                            <button @click="removeTab(ts, tIdx)" class="opacity-0 group-hover/tabbtn:opacity-100 text-slate-300 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-0.5"><X class="w-3 h-3" /></button>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <button @click="addTab(ts)" class="px-3 py-2 text-slate-400 hover:text-indigo-500"><Plus class="w-4 h-4" /></button>
                                    </template>
                                </draggable>

                                <!-- Tab Content -->
                                <div class="space-y-8">
                                    <div v-for="(tab, _) in ts.children" :key="tab.id" class="pl-4 border-l-2 border-indigo-200 dark:border-indigo-900">
                                        <div class="flex items-center gap-2 mb-4">
                                             <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Page:</span>
                                             <input v-model="tab.name" class="bg-transparent border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-500 w-full max-w-xs" />
                                        </div>

                                        <!-- Rows -->
                                        <!-- Note: Rows are kept as v-for for now as vertical DND inside a tab is less common, but could be upgraded easily -->
                                        <draggable 
                                            v-model="tab.children" 
                                            item-key="id" 
                                            handle=".row-handle"
                                            class="space-y-4"
                                        >
                                            <template #item="{ element: row, index: rIdx }">
                                                <div class="group/row relative pl-8">
                                                    <!-- Row Handle -->
                                                    <div class="absolute left-0 top-1/2 -translate-y-1/2 -mt-4 row-handle cursor-move text-slate-300 hover:text-slate-500 opacity-0 group-hover/row:opacity-100 transition-opacity p-1"><GripVertical class="w-4 h-4" /></div>

                                                    <!-- Delete Row Handle -->
                                                    <button @click="removeRow(tab, rIdx)" class="absolute left-0 top-1/2 -translate-y-1/2 mt-4 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover/row:opacity-100 transition-opacity"><Trash2 class="w-4 h-4" /></button>

                                                    <!-- Row Track -->
                                                    <div class="h-20 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex overflow-hidden">
                                                        <div v-for="(col, cIdx) in row.children" :key="col.id" :style="{ flex: `${col.width} 1 0%` }" 
                                                             class="relative border-r border-slate-100 dark:border-slate-700 group/col hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors flex flex-col justify-center items-center p-2">
                                                             
                                                             <!-- Resize Handles -->
                                                             <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity z-10 bg-white dark:bg-slate-800 rounded shadow-sm border border-slate-200 dark:border-slate-700 p-0.5">
                                                                 <button @click="resizeCol(row, cIdx as number, -1)" class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Minimize2 class="w-3 h-3" /></button>
                                                                 <button @click="resizeCol(row, cIdx as number, 1)" class="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Maximize2 class="w-3 h-3" /></button>
                                                                 <button @click="removeCol(row, cIdx as number)" class="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Trash2 class="w-3 h-3" /></button>
                                                             </div>

                                                             <span class="text-2xl font-black text-slate-500 dark:text-slate-600 group-hover/col:text-indigo-200 dark:group-hover/col:text-indigo-800 select-none">{{ col.width }}</span>
                                                             <input v-model="col.name" class="w-full text-center bg-transparent text-[10px] font-bold text-slate-500 border-none p-0 focus:ring-0" />
                                                        </div>

                                                        <!-- Add Column Zone -->
                                                        <button v-if="row.children.reduce((a: number, c: any) => a + c.width, 0) < 6" 
                                                                :style="{ flex: `${6 - row.children.reduce((a: number, c: any) => a + c.width, 0)} 1 0%` }"
                                                                @click="addCol(row)"
                                                                class="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 flex flex-col items-center justify-center text-slate-300 hover:text-indigo-500 transition-all group/add">
                                                            <Plus class="w-6 h-6 mb-1 group-hover/add:scale-110 transition-transform" />
                                                            <span class="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover/add:opacity-100">Add</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                        </draggable>
                                        
                                        <button @click="addRow(tab)" class="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-2 pl-8 py-2">
                                            <Layers class="w-4 h-4" /> Add Row
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </draggable>

                <div class="h-20"></div> <!-- Spacer for FAB -->
            </div>

            <!-- FAB -->
            <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
                <button @click="addTabSet" class="bg-indigo-600 hover:bg-indigo-500 text-white pl-4 pr-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2 font-bold text-sm">
                    <Plus class="w-5 h-5" /> New TabSet
                </button>
            </div>
        </template>

        <!-- Right Panel: Output -->
        <template #sidebar>
<CodeOutputPanel title="Extended Code" :code="scriptOutput" />
        </template>


    </ToolLayout>
</template>
