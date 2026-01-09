<script setup lang="ts">
import { ref, computed } from 'vue'
import { Palette, Settings, Layout as LayoutIcon } from 'lucide-vue-next'
import BaseInput from '@components/ui/BaseInput.vue'
import { useTemplateBuilder } from '../composables/useTemplateBuilder'
import { INVENTORY } from '../constants'

// Micro-Components
import PropGridSelector from './properties/PropGridSelector.vue'
import PropToggleGroup from './properties/PropToggleGroup.vue'
import PropBoolean from './properties/PropBoolean.vue'
import PropColorCompact from './properties/PropColorCompact.vue'

const { selectedItemId, widgets, rootPage } = useTemplateBuilder()
const activeTab = ref<'design' | 'properties'>('design')

// Computed Selection Helpers
const selectedItem = computed(() => {
    if (!selectedItemId.value) return null
    if (rootPage.value && rootPage.value.id === selectedItemId.value) return rootPage.value
    return widgets.value.find(i => i.id === selectedItemId.value)
})

const selectedInventoryItem = computed(() => {
    if (!selectedItem.value) return null
    return INVENTORY.find(i => i.id === selectedItem.value?.inventoryId)
})

// Filter helpers
const isManualProp = (name: string) => {
    // These are manually placed in specific layout slots
    return ['columnsLargeScreen', 'columnsMediumScreen', 'columnsSmallScreen', 
            'headerStyle', 'borderStyle', 'headerColor', 'fontColor', 
            'shadow', 'transparency', 'visibility'].includes(name)
}
</script>

<template>
    <div class="h-full flex flex-col bg-layer-01">
        
        <!-- HEADER & TABS (Carbon Style) -->
        <div class="px-4 py-3 border-b border-border-interactive bg-layer-01 shrink-0 space-y-3">
            <h3 class="text-xs font-bold text-text-secondary">Properties</h3>
            
            <!-- Segmented Control (Rectangular) -->
            <div class="flex bg-layer-01 border-b border-border-subtle">
                 <button 
                     @click="activeTab = 'design'"
                     class="flex-1 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors border-b-2"
                     :class="activeTab === 'design' ? 'border-interactive-01 text-text-primary bg-layer-02' : 'border-transparent text-text-secondary hover:bg-layer-hover'"
                 >
                     <Palette class="w-3.5 h-3.5" /> Design
                 </button>
                 <button 
                     @click="activeTab = 'properties'"
                     class="flex-1 px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors border-b-2"
                     :class="activeTab === 'properties' ? 'border-interactive-01 text-text-primary bg-layer-02' : 'border-transparent text-text-secondary hover:bg-layer-hover'"
                 >
                     <Settings class="w-3.5 h-3.5" /> Config
                 </button>
            </div>
        </div>

        <div v-if="selectedItem" class="flex-1 overflow-y-auto p-4 space-y-8 scrollbar-thin pb-32">
            
            <!-- IDENTIFICATION -->
            <div class="space-y-2">
                <div class="flex items-center justify-between text-[10px] text-text-secondary uppercase tracking-wider">
                     <span>Name</span>
                     <span class="font-mono text-text-disabled">{{ selectedItem.w }}x{{ selectedItem.h || 1 }}</span>
                </div>
                <BaseInput 
                    v-model="selectedItem.instanceName"
                    class="rounded-none bg-layer-02 !h-7 text-xs" 
                    placeholder="Reference Name"
                />
            </div>

            <!-- DESIGN TAB (The "Visual Cockpit") -->
            <template v-if="activeTab === 'design' && selectedInventoryItem">
                
                <!-- 1. Layout Strip (Dimensions) -->
                <div v-if="selectedInventoryItem.properties.some(p => p.section === 'design' && p.name === 'columnsLargeScreen')">
                    <PropGridSelector 
                        v-model="selectedItem.w" 
                        :max="6"
                        label="Grid Width"
                    />
                </div>

                <!-- 2. Theme Capsule (Header & Colors) -->
                <div class="space-y-2" v-if="selectedItem.inventoryId !== 'Spacer'">
                    <label class="text-[10px] text-text-secondary uppercase font-bold tracking-tight">Theme</label>
                    <div class="bg-layer-02 border border-border-subtle p-2 space-y-2">
                        
                        <!-- Header Position -->
                        <PropToggleGroup 
                            v-model="selectedItem.props['headerStyle']" 
                            :options="['INSIDE', 'OUTSIDE', 'NONE']"
                            label="Header"
                        />

                        <!-- Border Style -->
                        <PropToggleGroup 
                            v-model="selectedItem.props['borderStyle']" 
                            :options="['SOLID', 'NONE']"
                            label="Border"
                        />
                        
                        <!-- Color Row (Compacted) -->
                        <div class="grid grid-cols-2 gap-2 pt-1 border-t border-border-subtle/50">
                             <PropColorCompact v-model="selectedItem.headerColor" label="Bg" />
                             <PropColorCompact v-model="selectedItem.headerTextColor" label="Text" />
                        </div>
                    </div>
                </div>

                <!-- 3. Effects Box (Shadow & Transparency) -->
                 <div class="space-y-2">
                    <label class="text-[10px] text-text-secondary uppercase font-bold tracking-tight">Effects</label>
                    <div class="grid grid-cols-2 gap-2">
                         <!-- Shadow Switch -->
                        <div class="bg-layer-02 border border-border-subtle px-2 py-0.5 flex items-center h-full">
                            <PropBoolean 
                                v-model="selectedItem.props['shadow']" 
                                label="Shadow" 
                                class="w-full !border-0"
                            />
                        </div>
                        
                        <!-- Transparency Slider -->
                        <div class="bg-layer-02 border border-border-subtle px-2 py-1 space-y-0.5">
                            <div class="flex justify-between text-[9px] text-text-secondary">
                                <span>Transparency</span>
                                <span>{{ 100 - (selectedItem.props['transparency'] || 0) }}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" step="10"
                                v-model.number="selectedItem.props['transparency']"
                                class="w-full h-1 bg-layer-03 appearance-none cursor-pointer accent-interactive-01"
                            >
                        </div>
                    </div>
                </div>

                 <!-- 4. Visibility (Pills) -->
                 <div class="space-y-1 pt-2 border-t border-border-subtle">
                     <PropToggleGroup 
                         v-model="selectedItem.props['visibility']"
                         :options="['VISIBLE', 'NOVISIBLE', 'ADMINVISIBLEONLY']"
                         label="Visibility Rule"
                     />
                 </div>

                 <!-- Remaining Design Loop -->
                 <div class="space-y-4 pt-2">
                     <div v-for="prop in selectedInventoryItem.properties" :key="prop.name">
                        <template v-if="prop.section === 'design' && !isManualProp(prop.name)">
                             <!-- Render generic/other design props if any exist -->
                             <PropBoolean 
                                v-if="prop.uiType === 'switch' || prop.type === 'boolean'"
                                v-model="selectedItem.props[prop.name]"
                                :label="prop.label || prop.name"
                             />
                              <div v-else-if="prop.type === 'select'" class="space-y-1 py-1">
                                <label class="block text-[10px] text-text-secondary capitalize">{{ prop.label || prop.name }}</label>
                                <select 
                                v-model="selectedItem.props[prop.name]"
                                class="w-full h-8 text-xs bg-layer-02 border border-border-strong px-2 focus:border-interactive-01 focus:outline-none"
                                >
                                    <option v-for="opt in prop.options" :key="opt" :value="opt">{{ opt }}</option>
                                </select>
                            </div>
                        </template>
                     </div>
                 </div>

            </template>

            <!-- PROPERTIES TAB (Configuration Grid) -->
            <template v-if="activeTab === 'properties' && selectedInventoryItem">
                
                <!-- Boolean Grid (Feature Flags) -->
                <div class="grid grid-cols-2 gap-x-4 gap-y-1">
                     <template v-for="prop in selectedInventoryItem.properties" :key="'bool-'+prop.name">
                        <div v-if="prop.section === 'properties' && (prop.uiType === 'switch' || prop.type === 'boolean')">
                             <PropBoolean 
                                v-model="selectedItem.props[prop.name]"
                                :label="prop.label || prop.name"
                             />
                        </div>
                     </template>
                </div>

                <!-- Text/Select Fields -->
                <div class="space-y-4 pt-4 border-t border-border-subtle">
                     <template v-for="prop in selectedInventoryItem.properties" :key="'field-'+prop.name">
                        <div v-if="prop.section === 'properties' && prop.type !== 'boolean' && prop.uiType !== 'switch'">
                             
                             <div v-if="prop.type === 'select'" class="space-y-1">
                                <label class="block text-[10px] text-text-secondary capitalize">{{ prop.label || prop.name }}</label>
                                <select 
                                v-model="selectedItem.props[prop.name]"
                                class="w-full h-8 text-xs bg-layer-02 border border-border-strong px-2 focus:border-interactive-01 focus:outline-none rounded-sm transition-colors hover:border-text-secondary"
                                >
                                    <option v-for="opt in prop.options" :key="opt" :value="opt">{{ opt }}</option>
                                </select>
                            </div>

                            <BaseInput 
                                v-else
                                :label="prop.label || prop.name"
                                :type="prop.type"
                                v-model="selectedItem.props[prop.name]"
                                class="rounded-none"
                            />
                        </div>
                     </template>
                </div>

                 <div v-if="selectedInventoryItem.properties.filter(p => p.section === 'properties').length === 0" class="text-xs text-text-disabled italic text-center py-4">
                    No specific configuration for this item.
                 </div>
            </template>
        </div>
        
        <div v-else class="flex-1 flex flex-col items-center justify-center text-text-disabled p-8 text-center bg-layer-02/50">
            <LayoutIcon class="w-8 h-8 mb-3 opacity-20" />
            <p class="text-xs font-medium">Select an item to configure</p>
        </div>
    </div>
</template>
