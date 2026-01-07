<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'

import SmartGhostSelect from './SmartGhostSelect.vue'
import type { Vocabulary } from '../types'

const props = defineProps<{
    data: any
    path: string
    level: number
    isLast: boolean
}>()

const context = inject<{
    editPath: Ref<string | null>
    setEditPath: (path: string | null) => void
    handleUpdate: (path: string, val: any) => void
    vocab: Ref<Vocabulary>
}>('interactiveJson')!

// Inject Global Vocab Logic
const { getOptionsForPath } = inject<{ getOptionsForPath: (path: string) => string[] }>('pbacVocab')!

const isEditing = computed(() => context.editPath.value === props.path)

const isPrimitive = (v: any) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'

// Check for Atomic Arrays
const keyName = computed(() => props.path.split('.').pop())
const isAtomicArray = computed(() => Array.isArray(props.data) && (
    keyName.value === 'Subject' || 
    keyName.value === 'Action' || 
    (keyName.value === 'Right' && props.data.every(isPrimitive))
))

// Editing Logic
const options = computed(() => getOptionsForPath(props.path)) 

const isMultiAllowed = computed(() => {
    const k = keyName.value
    // Right (Value) can be multi (array).
    // Subject/Action are usually arrays, so if they appear as primitive, expanding to multi is consistent.
    // Effect, Comparison, and others (Left, Reference) are STRICTLY single.
    return ['Right', 'Subject', 'Action'].includes(k || '')
})

// Indentation
const style = computed(() => ({ paddingLeft: `${props.level * 2}ch` }))

const startEdit = (e: MouseEvent) => {
    e.stopPropagation()
    context.setEditPath(props.path)
}

const onUpdate = (val: any) => {
    context.handleUpdate(props.path, val)
    context.setEditPath(null) // FIX: Close on update
}

const cancelEdit = () => {
    context.setEditPath(null)
}

</script>

<template>
    <!-- Atomic Array (Rendered as single value block) -->
    <div v-if="isAtomicArray" class="inline">
        <div v-if="isEditing" class="inline-block align-top min-w-[200px]">
             <SmartGhostSelect 
                :model-value="data" 
                @update:model-value="onUpdate"
                :options="options"
                isMulti
                displayMode="text"
                class="bg-[#252526] border border-[#404040] rounded-sm min-h-[24px]"
                inputClassName="text-[#ce9178]"
                allowCustom
                autoFocus
            />
        </div>
        <span v-else @click="startEdit" class="text-[#ce9178] cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2 break-all whitespace-pre-wrap">
            [ {{ data.map((v: any) => `"${v}"`).join(', ') }} ]
        </span>
        <span v-if="!isLast" class="text-[#d4d4d4]">,</span>
    </div>

    <!-- Generic Array -->
    <div v-else-if="Array.isArray(data)">
        <div v-if="data.length === 0" :style="style">
            <span class="text-[#ffd700]">[]</span><span v-if="!isLast" class="text-[#d4d4d4]">,</span>
        </div>
        <div v-else>
            <div :style="style" class="text-[#ffd700]">[</div>
            <div v-for="(item, i) in data" :key="i">
                <InteractiveJsonNode 
                    :data="item" 
                    :path="`${path}.${i}`" 
                    :level="level + 1" 
                    :is-last="i === data.length - 1"
                />
            </div>
            <div :style="style"><span class="text-[#ffd700]">]</span><span v-if="!isLast" class="text-[#d4d4d4]">,</span></div>
        </div>
    </div>

    <!-- Object -->
    <div v-else-if="typeof data === 'object' && data !== null">
        <div v-if="Object.keys(data).length === 0" :style="style">
             <span class="text-[#ffd700]">{}</span><span v-if="!isLast" class="text-[#d4d4d4]">,</span>
        </div>
        <div v-else>
            <div :style="style" class="text-[#ffd700]">{</div>
            <div v-for="(key, i) in Object.keys(data)" :key="key">
                
                <!-- Object Property Row -->
                <div class="flex flex-wrap">
                    <div :style="{ paddingLeft: `${(level + 1) * 2}ch` }" class="whitespace-pre">
                        <span class="text-[#9cdcfe]">"{{ key }}"</span><span class="text-[#d4d4d4]">: </span>
                    </div>
                    
                    <div class="flex-1">
                        <InteractiveJsonNode 
                            :data="data[key]" 
                            :path="`${path}.${key}`" 
                            :level="0" 
                            :is-last="i === Object.keys(data).length - 1"
                        />
                    </div>
                </div>

            </div>
            <div :style="style"><span class="text-[#ffd700]">}</span><span v-if="!isLast" class="text-[#d4d4d4]">,</span></div>
        </div>
    </div>

    <!-- Primitive Value (Leaf) -->
    <div v-else class="inline-block">
        <div v-if="isEditing" class="inline-block align-top min-w-[150px]">
             <SmartGhostSelect 
                :model-value="data" 
                @update:model-value="onUpdate"
                :options="options"
                :is-multi="isMultiAllowed"
                displayMode="text"
                class="bg-[#252526] border border-[#404040] rounded-sm min-h-[24px]"
                inputClassName="text-[#ce9178]"
                allowCustom
                autoFocus
            />
        </div>
        <span v-else @click="startEdit" class="cursor-pointer hover:underline decoration-dotted decoration-gray-600 underline-offset-2 break-all whitespace-pre-wrap"
            :class="{
                'text-[#ce9178]': typeof data === 'string',
                'text-[#b5cea8]': typeof data === 'number',
                'text-[#569cd6]': typeof data === 'boolean'
            }"
        >
            <template v-if="typeof data === 'string'">"{{ data }}"</template>
            <template v-else>{{ String(data) }}</template>
        </span>
        <span v-if="!isLast" class="text-[#d4d4d4]">,</span>
    </div>
</template>
