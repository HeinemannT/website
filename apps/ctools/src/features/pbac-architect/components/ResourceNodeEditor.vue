<script setup lang="ts">
import { computed } from 'vue'
import { Trash, Plus, MoreVertical } from 'lucide-vue-next'
import SmartGhostSelect from './SmartGhostSelect.vue'
import type { ResourceNode, Vocabulary } from '../types'

const props = defineProps<{
    node: ResourceNode
    vocab?: Vocabulary
    level?: number
}>()

const emit = defineEmits<{
    (e: 'update:node', val: ResourceNode): void
    (e: 'remove'): void
}>()

const comparisons = ['=', '!=', 'Contains', '!~', 'ContainsAny', 'NotContainsAny']

const isGroup = computed(() => props.node.type === 'All' || props.node.type === 'Any')

const updateType = (newTypeVal: string) => {
    const nextType = newTypeVal as ResourceNode['type']

    // Reset defaults when switching
    const newNode = { ...props.node, type: nextType }
    
    if (nextType === 'Condition' && !newNode.condition) {
        newNode.condition = { Left: 'resource.type', Comparison: '=', Right: 'CeAsset' }
    } else if (nextType === 'HasAccessTo' && !newNode.accessReference) {
        newNode.accessReference = 'resource.parent'
    } else if ((nextType === 'All' || nextType === 'Any') && !newNode.children) {
        newNode.children = []
    }
    
    emit('update:node', newNode)
}

const addChild = () => {
    if (!props.node.children) {
        emit('update:node', { ...props.node, children: [] })
        return
    }
    const newChild: ResourceNode = {
        id: crypto.randomUUID(),
        type: 'Condition',
        condition: { Left: 'resource.type', Comparison: '=', Right: 'CeAsset' }
    }
    emit('update:node', {
        ...props.node,
        children: [...props.node.children, newChild]
    })
}

const updateChild = (idx: number, child: ResourceNode) => {
    if (!props.node.children) return
    const newChildren = [...props.node.children]
    newChildren[idx] = child
    emit('update:node', { ...props.node, children: newChildren })
}

const removeChild = (idx: number) => {
    if (!props.node.children) return
    const newChildren = props.node.children.filter((_, i) => i !== idx)
    emit('update:node', { ...props.node, children: newChildren })
}

// Helpers for Rights
const isMultiValue = (op: string) => ['Contains', '!~', 'ContainsAny', 'NotContainsAny'].includes(op)

const updateCondition = (field: 'Left' | 'Right' | 'Comparison', val: any) => {
    if (!props.node.condition) return
    
    let newComparison = props.node.condition.Comparison
    let newRight = field === 'Right' ? val : props.node.condition.Right
    let newLeft = field === 'Left' ? val : props.node.condition.Left

    // Auto-switch operator if multi-selecting (Legacy Parity)
    if (field === 'Right') {
        const isArray = Array.isArray(val)
        // If we received an array but current op is single-value, switch to 'Contains'
        if (isArray && !isMultiValue(newComparison)) {
             newComparison = newComparison === '!=' ? '!~' : 'Contains'
        }
    }

    // Auto-fix Value if switching to single-value operator (Legacy Parity)
    if (field === 'Comparison') {
        newComparison = val
        if (!isMultiValue(newComparison) && Array.isArray(newRight)) {
             newRight = newRight[0] || ''
        }
    }

    emit('update:node', {
        ...props.node,
        condition: { 
            Left: newLeft, 
            Right: newRight, 
            Comparison: newComparison 
        }
    })
}

// Vocab options
const rightOptions = computed(() => {
    return [...(props.vocab?.types || []), 'true', 'false', '0', '1']
})

</script>

<template>
    <div class="relative group transition-all" 
        :class="[
            node.type === 'Condition' ? 'py-2' : 'border border-border-subtle p-4 bg-layer-01',
            node.type === 'HasAccessTo' ? 'border-dashed' : ''
        ]"
    >
        
        <!-- Carbon Header -->
        <div class="flex items-center justify-between mb-4 pb-2 border-b border-border-strong">
             <div class="relative flex items-center gap-4">
                <span class="text-[12px] text-text-secondary font-normal uppercase tracking-wider">Logic Type</span>
                <div class="relative group/switcher cursor-pointer hover:bg-layer-03 px-2 py-1 transition-colors">
                     <span class="text-sm font-bold text-text-primary flex items-center gap-2">
                        {{ node.type === 'All' || node.type === 'Any' ? 'Group Match' : node.type === 'HasAccessTo' ? 'Inheritance' : 'Condition' }}
                        <MoreVertical class="w-4 h-4 text-text-tertiary" />
                    </span>
                    <select 
                        :value="node.type"
                        @change="updateType(($event.target as HTMLSelectElement).value)"
                        class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    >
                        <option value="Condition">Condition (Field Check)</option>
                        <option value="All">Group (Match ALL)</option>
                        <option value="Any">Group (Match ANY)</option>
                        <option value="HasAccessTo">Inheritance (Reference)</option>
                    </select>
                </div>
             </div>
             
             <button v-if="level !== 0" @click="emit('remove')" class="text-text-tertiary hover:text-red-500 transition-colors p-1" title="Remove">
                <Trash class="w-4 h-4" />
            </button>
        </div>

        <!-- Logic Body -->
        <div class="space-y-2">
            
            <!-- Group Mode -->
            <template v-if="isGroup && node.children">
                <div class="mb-4 flex items-center gap-2 text-xs text-text-secondary font-medium select-none pl-1">
                    <span>Match</span>
                    <button 
                        @click="updateType(node.type === 'All' ? 'Any' : 'All')"
                        class="font-bold text-interactive-01 hover:text-text-primary hover:bg-layer-03 px-2 py-0.5 transition-colors uppercase tracking-wider border-b border-interactive-01 border-dashed"
                    >
                        {{ node.type === 'All' ? 'ALL (AND)' : 'ANY (OR)' }}
                    </button>
                    <span>of the following rules:</span>
                </div>

                <div class="space-y-4 pl-4 border-l border-border-subtle ml-2">
                    <ResourceNodeEditor 
                        v-for="(child, idx) in node.children" 
                        :key="child.id" 
                        :node="child"
                        :vocab="vocab"
                        :level="(level || 0) + 1"
                        @update:node="updateChild(idx, $event)"
                        @remove="removeChild(idx)"
                    />
                    
                    <BaseButton size="sm" variant="ghost" class="w-full border border-dashed border-border-strong text-text-tertiary hover:border-interactive-01 hover:text-interactive-01 rounded-none justify-start pl-4" @click="addChild">
                        <Plus class="w-3 h-3 mr-2" /> Add Rule
                    </BaseButton>
                </div>
            </template>

             <!-- Condition Mode -->
            <template v-else-if="node.type === 'Condition' && node.condition">
                 <div class="flex flex-col gap-0 border border-border-subtle bg-layer-01 shadow-sm hover:shadow-md transition-shadow">
                     
                     <div class="p-4 grid grid-cols-[1.5fr_1fr] gap-4 items-start border-b border-border-subtle">
                         <!-- Field (Property) -->
                         <div class="flex flex-col gap-1">
                             <label class="text-[12px] text-text-secondary font-normal">Property</label>
                             <div class="w-full bg-layer-02 border-b border-border-strong h-[40px] flex items-center px-3 hover:bg-layer-03 transition-colors relative group/field">
                                <SmartGhostSelect 
                                    :model-value="node.condition.Left" 
                                    @update:model-value="updateCondition('Left', $event)"
                                    placeholder="Select Property"
                                    :options="vocab?.properties || []"
                                    class="w-full text-sm text-text-primary"
                                    allowCustom
                                />
                                <div class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-interactive-01 transform scale-x-0 group-focus-within/field:scale-x-100 transition-transform origin-center"></div>
                             </div>
                         </div>
                         
                         <!-- Operator (Expanded) -->
                         <div class="flex flex-col gap-1">
                             <label class="text-[12px] text-text-secondary font-normal">Operator</label>
                             <div class="w-full bg-layer-02 border-b border-border-strong h-[40px] flex items-center px-3 hover:bg-layer-03 transition-colors relative group/op">
                                <SmartGhostSelect 
                                    :model-value="node.condition.Comparison" 
                                    @update:model-value="updateCondition('Comparison', $event)" 
                                    :options="comparisons" 
                                    class="w-full text-sm font-bold text-interactive-01"
                                    inputClassName="text-left"
                                />
                                <div class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-interactive-01 transform scale-x-0 group-focus-within/op:scale-x-100 transition-transform origin-center"></div>
                             </div>
                         </div>
                     </div>

                     <!-- Row 2: Value (Full Width) -->
                     <div class="p-4 bg-layer-01/50">
                         <div class="flex flex-col gap-1">
                             <label class="text-[12px] text-text-secondary font-normal">Value (Type)</label>
                             <div class="w-full bg-layer-02 border-b border-border-strong min-h-[40px] flex items-center px-3 py-1 hover:bg-layer-03 transition-colors relative group/val">
                                <SmartGhostSelect 
                                    :model-value="Array.isArray(node.condition.Right) && !isMultiValue(node.condition.Comparison) ? node.condition.Right[0] : node.condition.Right"
                                    @update:model-value="updateCondition('Right', $event)" 
                                    placeholder="Enter Value" 
                                    :options="rightOptions"
                                    class="w-full text-sm font-mono text-text-primary"
                                    :isMulti="isMultiValue(node.condition.Comparison)"
                                    displayMode="chips"
                                    allowCustom
                                />
                                <div class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-interactive-01 transform scale-x-0 group-focus-within/val:scale-x-100 transition-transform origin-center"></div>
                             </div>
                         </div>
                     </div>
                </div>
            </template>

            <!-- Relation Mode -->
            <template v-else-if="node.type === 'HasAccessTo'">
                 <div class="grid grid-cols-2 gap-2">
                     <!-- Access Reference (Property) -->
                     <SmartGhostSelect 
                        :model-value="node.accessReference || ''" 
                        @update:model-value="emit('update:node', { ...node, accessReference: String($event) })" 
                        placeholder="resource.parent" 
                        :options="vocab?.properties || []"
                        allowCustom
                     />
                     <!-- Access Role (Role) -->
                     <SmartGhostSelect 
                        :model-value="node.accessRole || ''" 
                        @update:model-value="emit('update:node', { ...node, accessRole: String($event) })" 
                        placeholder="Any Role" 
                        :options="vocab?.roles || []"
                        allowCustom
                     />
                 </div>
            </template>

        </div>
    </div>
</template>
