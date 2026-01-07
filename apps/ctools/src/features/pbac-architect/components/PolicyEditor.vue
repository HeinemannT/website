<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash } from 'lucide-vue-next'
import BaseInput from '@components/ui/BaseInput.vue'
import SmartGhostSelect from './SmartGhostSelect.vue'
import ResourceNodeEditor from './ResourceNodeEditor.vue'
import type { Policy, Vocabulary } from '../types'

const props = defineProps<{
    policy: Policy
    vocab?: Vocabulary
}>()

const emit = defineEmits<{
    (e: 'change', val: Policy): void
}>()

// Local copy for immutability during edits? 
// No, standard Vue v-model pattern is better for form bindings if we trust the parent to update.
// But passed prop is reactive object from usePersistentState. We can mutate it directly for deep updates 
// OR emit full object. Let's emit full object for safety and history tracking readiness.
// Actually, deep mutation is common in Vue 3 ViewModels. Let's try direct mutation for fields, 
// but emit 'change' for triggers.

const localPolicy = ref<Policy>(JSON.parse(JSON.stringify(props.policy)))

watch(() => props.policy, (newVal) => {
    // Update local state if prop changes (e.g. from JSON editor)
    // We compare JSON to avoid unnecessary updates/cursor jumps if technically same
    if (JSON.stringify(newVal) !== JSON.stringify(localPolicy.value)) {
        localPolicy.value = JSON.parse(JSON.stringify(newVal))
    }
}, { deep: true })

const emitChange = () => {
    emit('change', localPolicy.value)
}

// const addStatement = () => {
//    localPolicy.value.Statements.push(createDefaultStatement())
//    emitChange()
// }

const removeStatement = (id: string) => {
    localPolicy.value.Statements = localPolicy.value.Statements.filter(s => s.id !== id)
    emitChange()
}

const actions = ['Read', 'Update', 'Create', 'Delete']



</script>

<template>
    <div class="p-6 space-y-8 font-sans h-full overflow-y-auto custom-scroll pb-20">
        
        <!-- Header -->
            <!-- Policy & Version Row -->
            <div class="bg-layer-01 border-b border-border-subtle p-6 mb-0 sticky top-0 z-10 shadow-sm">
                 <div class="flex gap-8 items-start max-w-5xl mx-auto">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Policy Name</label>
                        <input 
                            v-model="localPolicy.name" 
                            @change="emitChange"
                            class="w-full bg-layer-02 border-b border-border-strong focus:border-interactive-01 outline-none px-4 py-2.5 text-sm text-text-primary placeholder-text-placeholder transition-colors" 
                            placeholder="e.g. Finance Department Access"
                        />
                    </div>
                    <div class="w-32 shrink-0">
                        <label class="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">Version</label>
                        <input 
                            v-model="localPolicy.Version" 
                            @change="emitChange"
                            class="w-full bg-layer-02 border-b border-border-strong focus:border-interactive-01 outline-none px-4 py-2.5 text-sm font-mono text-text-primary placeholder-text-placeholder transition-colors text-right"
                            placeholder="1.0"
                        />
                    </div>
                </div>
            </div>

            <div class="p-6 max-w-5xl mx-auto space-y-8">

            <div v-for="(stmt, idx) in localPolicy.Statements" :key="stmt.id" class="bg-layer-01 border border-border-subtle shadow-sm flex flex-col relative group rounded-sm overflow-hidden mb-6">
                
                <!-- Statement Header: Effect Switch & Meta -->
                <div class="flex h-10 border-b border-border-subtle">
                     <!-- Segmented Control for Effect -->
                     <div class="flex w-48 border-r border-border-subtle">
                        <button 
                            @click="stmt.Effect = 'Allow'; emitChange()"
                            class="flex-1 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-layer-03"
                            :class="stmt.Effect === 'Allow' ? 'bg-[#198038] text-white hover:bg-[#198038]' : 'text-text-tertiary bg-layer-02'"
                        >
                            Allow
                        </button>
                        <button 
                            @click="stmt.Effect = 'Deny'; emitChange()"
                            class="flex-1 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-layer-03"
                            :class="stmt.Effect === 'Deny' ? 'bg-[#da1e28] text-white hover:bg-[#da1e28]' : 'text-text-tertiary bg-layer-02'"
                        >
                            Deny
                        </button>
                     </div>

                     <div class="flex-1 flex items-center justify-end px-4 bg-layer-02">
                        <button 
                            @click="removeStatement(stmt.id)" 
                            class="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-red-500 hover:bg-layer-03 rounded" 
                            title="Delete Rule"
                        >
                            <Trash class="w-4 h-4" />
                        </button>
                     </div>
                </div>

                <div class="p-5 flex flex-col gap-6">
                    
                    <!-- 1. SUBJECTS (WHO) -->
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-bold text-text-secondary uppercase tracking-wide flex items-center gap-2">
                            Subjects <span class="text-[10px] text-text-tertiary font-normal normal-case">(Who applies?)</span>
                        </label>
                        <!-- Carbon MultiSelect Style: Flat, Bottom Border, Gray BG -->
                        <div class="w-full bg-layer-02 border-b border-border-strong min-h-[48px] flex items-center px-4 py-2 focus-within:border-interactive-01 transition-colors hover:bg-layer-03 relative group/subject">
                            <SmartGhostSelect
                                :model-value="stmt.Subject" 
                                @update:model-value="stmt.Subject = $event; emitChange()"
                                placeholder="Select Roles..."
                                :options="vocab?.roles || []"
                                isMulti
                                displayMode="chips"
                                allowCustom
                                class="w-full"
                            />
                            <div class="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-interactive-01 transform scale-x-0 group-focus-within/subject:scale-x-100 transition-transform origin-center"></div>
                        </div>
                    </div>

                    <!-- 2. ACTIONS (WHAT) - Compact Rectangular Toggles -->
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold text-text-secondary uppercase tracking-wide">Actions</label>
                        <div class="flex items-center border border-border-subtle w-fit rounded-sm overflow-hidden">
                            <button 
                                v-for="action in actions" 
                                :key="action"
                                @click="() => {
                                    if (stmt.Action.includes(action)) stmt.Action = stmt.Action.filter(a => a !== action)
                                    else stmt.Action = [...stmt.Action, action]
                                    emitChange()
                                }"
                                class="h-8 px-4 text-xs font-medium border-r border-border-subtle last:border-r-0 transition-colors uppercase tracking-wider"
                                :class="stmt.Action.includes(action) 
                                    ? 'bg-text-primary text-layer-01 hover:bg-text-secondary' 
                                    : 'bg-layer-01 text-text-secondary hover:bg-layer-02 hover:text-text-primary'"
                            >
                                {{ action }}
                            </button>
                        </div>
                    </div>

                    <!-- 3. RESOURCES (WHERE) -->
                    <div class="flex flex-col gap-2">
                        <label class="text-xs font-bold text-text-secondary uppercase tracking-wide">Resources</label>
                        <div class="border border-border-subtle rounded-sm bg-layer-01">
                            <ResourceNodeEditor 
                                :node="stmt.Resource" 
                                :vocab="vocab"
                                isRoot
                                @update:node="(val) => { stmt.Resource = val; emitChange() }"
                            />
                        </div>
                    </div>

                </div>
            </div>
            </div>

             <div v-if="localPolicy.Statements.length === 0" class="text-center py-8 text-text-tertiary text-xs border border-dashed border-border-strong bg-layer-02/50">
                No statements defined. Effectively denies everything.
            </div>


    </div>
</template>
