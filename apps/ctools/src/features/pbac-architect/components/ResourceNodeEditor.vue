<script setup lang="ts">
import { computed } from 'vue'
import { Trash } from 'lucide-vue-next'
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
    <div class="border border-border-subtle rounded-sm p-3 bg-layer-02 relative group">
        
        <!-- Header / Type Switcher -->
        <div class="flex items-center justify-between mb-2">
            
            <!-- Logic Type Dropdown (Standardized) -->
             <div class="w-[180px] h-8">
                <SmartGhostSelect 
                    :model-value="node.type" 
                    @update:model-value="updateType"
                    :options="['Condition', 'All', 'Any', 'HasAccessTo']"
                    class="h-full w-full"
                    inputClassName="font-bold text-sm tracking-wide"
                />
             </div>
            
            <button v-if="level !== 0" @click="emit('remove')" class="text-text-tertiary hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash class="w-3 h-3" />
            </button>
        </div>

        <!-- Logic Body -->
        <div class="space-y-2">
            
            <!-- Group Mode -->
            <template v-if="isGroup && node.children">
                <div class="space-y-2 pl-4 border-l border-border-subtle">
                    <ResourceNodeEditor 
                        v-for="(child, idx) in node.children" 
                        :key="child.id" 
                        :node="child"
                        :vocab="vocab"
                        :level="(level || 0) + 1"
                        @update:node="updateChild(idx, $event)"
                        @remove="removeChild(idx)"
                    />
                    
                    <BaseButton size="sm" variant="ghost" class="w-full border border-dashed border-border-strong text-text-tertiary" @click="addChild">
                        <Plus class="w-3 h-3 mr-1" /> Add Rule
                    </BaseButton>
                </div>
            </template>

            <!-- Condition Mode -->
            <template v-else-if="node.type === 'Condition' && node.condition">
                 <!-- Flex Row for alignment -->
                 <div class="flex items-center gap-2 h-8">
                     <!-- Property -->
                     <div class="flex-1 h-full min-w-[120px] px-1 border-b border-transparent hover:border-border-subtle transition-colors">
                         <SmartGhostSelect 
                            :model-value="node.condition.Left" 
                            @update:model-value="updateCondition('Left', $event)"
                            placeholder="Property"
                            :options="vocab?.properties || []"
                            class="w-full h-full"
                            allowCustom
                         />
                     </div>
                     <!-- Comparison -->
                     <div class="w-[60px] h-full px-1 flex justify-center items-center">
                         <SmartGhostSelect 
                            :model-value="node.condition.Comparison" 
                            @update:model-value="updateCondition('Comparison', $event)" 
                            :options="comparisons" 
                            class="w-full h-full text-center"
                            inputClassName="text-center text-interactive-01 font-bold"
                        />
                     </div>
                     <!-- Value -->
                     <div class="flex-[1.5] h-full min-w-[150px] px-1 border-b border-transparent hover:border-border-subtle transition-colors">
                         <SmartGhostSelect 
                            :model-value="Array.isArray(node.condition.Right) && !isMultiValue(node.condition.Comparison) ? node.condition.Right[0] : node.condition.Right"
                            @update:model-value="updateCondition('Right', $event)" 
                            placeholder="Value" 
                            :options="rightOptions"
                            class="w-full h-full"
                            :isMulti="isMultiValue(node.condition.Comparison)"
                            displayMode="text"
                            allowCustom
                         />
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
