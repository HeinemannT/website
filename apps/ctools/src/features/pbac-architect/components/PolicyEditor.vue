<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash } from 'lucide-vue-next'
import BaseInput from '@components/ui/BaseInput.vue'
import SmartGhostSelect from './SmartGhostSelect.vue'
import ResourceNodeEditor from './ResourceNodeEditor.vue'
import { createDefaultStatement } from '../composables/usePbacUtils'
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

const addStatement = () => {
    localPolicy.value.Statements.push(createDefaultStatement())
    emitChange()
}

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
             <div class="grid grid-cols-12 gap-4 mb-6">
                <div class="col-span-8">
                     <BaseInput label="Policy Name" v-model="localPolicy.name" @change="emitChange" class="text-lg font-light" placeholder="e.g. Employee Access" />
                </div>
                <div class="col-span-4">
                     <BaseInput label="Version" v-model="localPolicy.Version" @change="emitChange" class="font-mono text-right" placeholder="1.0" />
                </div>
            </div>

            <div v-for="stmt in localPolicy.Statements" :key="stmt.id" class="bg-layer-01 border border-border-subtle shadow-sm flex flex-col relative group rounded-sm overflow-hidden">
                
                <!-- Statement Header: Effect Switch & Actions -->
                <div class="bg-layer-02 border-b border-border-subtle px-4 py-3 flex items-center justify-between">
                     
                     <div class="flex items-center gap-4">
                        <!-- Effect: Simple Toggle -->
                        <div class="flex items-center gap-0.5">
                            <button 
                                @click="stmt.Effect = 'Allow'; emitChange()"
                                class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border"
                                :class="stmt.Effect === 'Allow' 
                                    ? 'bg-green-600 text-white border-green-700' 
                                    : 'bg-transparent text-text-tertiary border-transparent hover:text-text-primary hover:bg-layer-03'"
                            >
                                Allow
                            </button>
                            <button 
                                @click="stmt.Effect = 'Deny'; emitChange()"
                                class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all border"
                                :class="stmt.Effect === 'Deny' 
                                    ? 'bg-red-600 text-white border-red-700' 
                                    : 'bg-transparent text-text-tertiary border-transparent hover:text-text-primary hover:bg-layer-03'"
                            >
                                Deny
                            </button>
                        </div>
                     </div>

                     <!-- Delete Button -->
                    <button @click="removeStatement(stmt.id)" class="text-text-tertiary hover:text-red-500 transition-colors" title="Delete Statement">
                        <Trash class="w-4 h-4" />
                    </button>
                </div>

                <div class="p-4 space-y-6">
                    
                    <!-- Unified Permissions Grid -->
                    <div class="space-y-4">
                        
                        <!-- WHO: Subject -->
                        <div class="flex items-center">
                            <div class="w-32 flex items-center gap-2">
                                <div class="w-1 h-3 bg-interactive-01"></div>
                                <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">Who</h4>
                            </div>
                            <div class="flex-1 min-w-0">
                                <SmartGhostSelect
                                    :model-value="stmt.Subject" 
                                    @update:model-value="stmt.Subject = $event; emitChange()"
                                    placeholder="Select Roles..."
                                    :options="vocab?.roles || []"
                                    isMulti
                                    displayMode="text"
                                    allowCustom
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <!-- WHAT: Permissions (Actions) -->
                        <div class="flex items-center">
                            <div class="w-32 flex items-center gap-2">
                                <div class="w-1 h-3 bg-interactive-01"></div>
                                <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">What</h4>
                            </div>
                            <div class="flex-1 min-w-0">
                                <SmartGhostSelect 
                                    :model-value="stmt.Action" 
                                    @update:model-value="stmt.Action = $event; emitChange()"
                                    placeholder="Select Actions..."
                                    :options="actions"
                                    isMulti
                                    displayMode="text"
                                    class="w-full"
                                />
                            </div>
                        </div>

                    </div>

                    <!-- WHERE: Resource Logic -->
                    <div>
                         <div class="flex items-center gap-2 mb-2">
                            <div class="w-1 h-3 bg-interactive-01"></div>
                            <h4 class="text-xs font-bold text-text-primary uppercase tracking-wider">Where</h4>
                            <span class="text-xs text-text-tertiary ml-auto">(Resource Condition)</span>
                        </div>
                        <ResourceNodeEditor 
                            :node="stmt.Resource" 
                            :vocab="vocab"
                            @update:node="(val) => { stmt.Resource = val; emitChange() }"
                        />
                    </div>

                </div>
            </div>

             <div v-if="localPolicy.Statements.length === 0" class="text-center py-8 text-text-tertiary text-xs border border-dashed border-border-strong bg-layer-02/50">
                No statements defined. Effectively denies everything.
            </div>


    </div>
</template>
