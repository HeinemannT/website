<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import draggable from 'vuedraggable'
import { 
    Folder, Trash2, Plus, X, Minimize2, Maximize2, 
    Monitor, Smartphone, Layout,
    HelpCircle, GripVertical
} from 'lucide-vue-next'
import IconRowExpand from '@components/icons/IconRowExpand.vue'
import ToolLayout from '@components/layout/ToolLayout.vue'
import ToolHeader from '@components/layout/ToolHeader.vue'
import { useLayoutBuilder } from '../composables/useLayoutBuilder'

import { TOOLS } from '@config/tools'

const CodeOutputPanel = defineAsyncComponent(() => import('@components/ui/CodeOutputPanel.vue'))

// State
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

const tool = TOOLS.find(t => t.id === 'layout')!

// Initialize
init()

</script>

<template>
    <ToolLayout sidebarClass="w-full lg:w-80">
        
        <!-- Main Canvas -->
        <template #main>
            <!-- Standard Tool Header -->
            <ToolHeader title="Layout Builder" :theme="tool.headerTheme">
                <template #center>
                     <div class="hidden lg:flex items-center gap-4">
                          <!-- Strategy Selector -->
                          <div class="flex items-center divide-x divide-border-subtle border border-border-subtle bg-layer-01 rounded-md overflow-hidden">
                              <button @click="mobileStrategy = 'mirror'" :class="mobileStrategy === 'mirror' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"><Monitor class="w-3.5 h-3.5" /> Mirror</button>
                              <button @click="mobileStrategy = 'stack'" :class="mobileStrategy === 'stack' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"><Smartphone class="w-3.5 h-3.5" /> Stack</button>
                              <button @click="mobileStrategy = 'grid'" :class="mobileStrategy === 'grid' ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:text-text-primary hover:bg-layer-02'" class="px-3 py-1.5 type-ui-control transition-colors flex items-center gap-2"><Layout class="w-3.5 h-3.5" /> Grid</button>
                          </div>
                         
                         <div class="relative group border-l border-white/20 pl-2">
                             <HelpCircle class="w-3.5 h-3.5 text-white/60 hover:text-white cursor-help transition-colors" />
                             <!-- Tooltip Dropdown -->
                             <div class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-80 p-5 bg-layer-01 border border-border-strong shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto transform origin-top translate-y-1 group-hover:translate-y-0">
                                 <h4 class="font-bold text-text-primary mb-3 text-xs uppercase tracking-widest border-b border-border-subtle pb-2">Mobile Layout Strategy</h4>
                                 <ul class="space-y-3 text-[11px] text-text-secondary leading-relaxed">
                                     <li class="flex flex-col gap-0.5">
                                        <strong class="text-interactive-01 font-bold uppercase text-[10px]">Mirror Desktop</strong>
                                        <span>Use the exact same structure as desktop.</span>
                                     </li>
                                     <li class="flex flex-col gap-0.5">
                                        <strong class="text-interactive-01 font-bold uppercase text-[10px]">Stack Vertically</strong>
                                        <span>Force all columns to stack (100% width, 6 columns) on mobile devices. Safe choice for readability</span>
                                     </li>
                                     <li class="flex flex-col gap-0.5">
                                        <strong class="text-interactive-01 font-bold uppercase text-[10px]">Grid Split</strong>
                                        <span>Try to arrange items in a 2-column grid (50% width) on mobile.</span>
                                     </li>
                                 </ul>
                             </div>
                         </div>
                    </div>
                </template>

                <template #actions>
                    <div class="flex items-center gap-3">
                         <span class="text-xs font-bold text-white/80 uppercase">targetFolder</span>
                         <input v-model="rootParentId" class="bg-transparent border-b border-white/30 hover:border-white focus:border-white w-32 text-xs font-mono font-medium focus:outline-none text-white placeholder-white/50 transition-colors" />
                    </div>
                </template>
            </ToolHeader>

            <!-- Navbar Sub-header for tool settings (Mobile only backup) -->
            <div class="md:hidden border-b border-border-subtle p-4 bg-layer-01 overflow-x-auto whitespace-nowrap">
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
                        <div class="bg-layer-01 rounded-none shadow-none border border-border-subtle overflow-hidden transition-all">
                            
                            <!-- TabSet Header -->
                            <div class="bg-layer-02 border-b border-border-subtle p-3 flex justify-between items-center group/ts">
                                <div class="flex items-center gap-3">
                                    <div class="ts-handle cursor-move text-text-disabled hover:text-text-primary"><GripVertical class="w-4 h-4" /></div>
                                    <Folder class="w-4 h-4 text-interactive-01" />
                                    <span class="text-xs font-bold text-text-secondary uppercase tracking-widest">TabSet</span>
                                    <input v-model="ts.name" class="bg-transparent text-sm font-bold text-text-primary focus:outline-none border-b border-border-strong hover:border-interactive-01 focus:border-interactive-01 rounded-none px-2 -ml-2 transition-colors" />
                                </div>
                                <button @click="removeTabSet(tsIdx)" class="text-text-disabled hover:text-red-600 transition-colors"><Trash2 class="w-4 h-4" /></button>
                            </div>

                            <!-- Tabs Container -->
                            <div class="p-6 bg-layer-01">
                                <!-- Custom Tab Nav (Draggable) -->
                                <draggable 
                                    v-model="ts.children" 
                                    item-key="id" 
                                    class="flex flex-wrap border-b border-border-subtle gap-1 mb-6 bg-layer-01 px-4 pt-2"
                                    handle=".tab-handle"
                                >
                                    <template #item="{ element: tab, index: tIdx }">
                                        <div class="relative group/tabbtn px-3 py-2 bg-layer-02 rounded-t-md border-t border-x border-border-subtle -mb-px flex items-center gap-2 shadow-none hover:bg-layer-02-hover cursor-pointer w-32 justify-between">
                                            <div class="flex items-center gap-2 min-w-0">
                                                <div class="tab-handle cursor-move text-text-disabled hover:text-text-primary"><GripVertical class="w-3 h-3" /></div>
                                                <span class="text-xs font-bold truncate text-text-primary">{{ tab.name }}</span>
                                            </div>
                                            <button @click.stop="removeTab(ts, tIdx)" class="text-text-disabled hover:text-red-600 rounded-sm p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20"><X class="w-3 h-3" /></button>
                                        </div>
                                    </template>
                                    <template #footer>
                                        <button @click="addTab(ts)" class="px-3 py-2 text-text-secondary hover:text-interactive-01 hover:bg-layer-02 rounded-t-md border border-transparent hover:border-border-subtle transition-all"><Plus class="w-4 h-4" /></button>
                                    </template>
                                </draggable>

                                <!-- Tab Content -->
                                <div class="space-y-8">
                                    <div v-for="(tab, _) in ts.children" :key="tab.id" class="pl-4 border-l-2 border-interactive-01">
                                        <div class="flex items-center gap-2 mb-4">
                                             <span class="text-[10px] font-bold text-interactive-01 uppercase tracking-widest">Name:</span>
                                             <input v-model="tab.name" class="bg-transparent border-b border-border-strong hover:border-interactive-01 rounded-none px-2 py-0.5 text-xs font-bold text-text-primary focus:outline-none focus:border-interactive-01 w-full max-w-xs transition-colors" />
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
                                                    <div class="absolute left-0 top-1/2 -translate-y-1/2 -mt-4 row-handle cursor-move text-text-disabled hover:text-text-primary transition-opacity p-1"><GripVertical class="w-4 h-4" /></div>

                                                    <!-- Delete Row Handle -->
                                                    <button @click="removeRow(tab, rIdx)" class="absolute left-0 top-1/2 -translate-y-1/2 mt-4 p-1 text-text-disabled hover:text-red-600 hover:bg-layer-02 rounded-none transition-colors"><Trash2 class="w-4 h-4" /></button>

                                                    <!-- Row Track -->
                                                    <div class="h-20 bg-layer-01 rounded-none border border-border-subtle shadow-none flex overflow-hidden">
                                                        <div v-for="(col, cIdx) in row.children" :key="col.id" :style="{ flex: `${col.width} 1 0%` }" 
                                                             class="relative border-r border-border-subtle group/col hover:bg-layer-02 transition-colors flex flex-col justify-center items-center p-2">
                                                             
                                                             <!-- Resize Handles -->
                                                             <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover/col:opacity-100 transition-opacity z-10 bg-layer-01 rounded-none shadow-none border border-border-subtle p-0.5">
                                                                 <button @click="resizeCol(row, cIdx as number, -1)" class="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-interactive-01 hover:bg-layer-02 rounded-none"><Minimize2 class="w-3 h-3" /></button>
                                                                 <button @click="resizeCol(row, cIdx as number, 1)" class="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-interactive-01 hover:bg-layer-02 rounded-none"><Maximize2 class="w-3 h-3" /></button>
                                                                 <button @click="removeCol(row, cIdx as number)" class="w-5 h-5 flex items-center justify-center text-text-secondary hover:text-red-600 hover:bg-layer-02 rounded-none"><Trash2 class="w-3 h-3" /></button>
                                                             </div>

                                                             <span class="text-2xl font-black text-text-secondary group-hover/col:text-interactive-01 select-none">{{ col.width }}</span>
                                                             <input v-model="col.name" class="w-full text-center bg-transparent text-[10px] font-bold text-text-secondary border-none p-0 focus:ring-0" />
                                                        </div>

                                                        <!-- Add Column Zone -->
                                                        <button v-if="row.children.reduce((a: number, c: any) => a + c.width, 0) < 6" 
                                                                :style="{ flex: `${6 - row.children.reduce((a: number, c: any) => a + c.width, 0)} 1 0%` }"
                                                                @click="addCol(row)"
                                                                class="border-2 border-dashed border-border-strong hover:border-interactive-01 hover:bg-layer-02 flex flex-col items-center justify-center text-text-secondary hover:text-interactive-01 transition-all group/add">
                                                            <Plus class="w-6 h-6 mb-1 group-hover/add:scale-110 transition-transform" />
                                                            <span class="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover/add:opacity-100">Add</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </template>
                                        </draggable>
                                        
                                        <button @click="addRow(tab)" class="text-xs font-bold text-text-secondary hover:text-interactive-01 flex items-center gap-2 pl-8 py-2">
                                            <IconRowExpand class="w-4 h-4" /> Add Row
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
                <button @click="addTabSet" class="bg-interactive-01 hover:bg-interactive-01-hover text-white pl-4 pr-6 py-3 rounded-none shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-bold text-sm">
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
