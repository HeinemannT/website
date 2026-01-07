<script setup lang="ts">
import { computed } from 'vue'
import type { Policy } from '../types'
import { usePbacValidator, type IssueSeverity } from '../composables/usePbacValidator'
import { AlertCircle, AlertTriangle, Info, CheckCircle, ArrowRight } from 'lucide-vue-next'

const props = defineProps<{
    policy: Policy
}>()

const emit = defineEmits<{
    (e: 'navigate', stmtId: string): void
}>()

const { validatePolicy } = usePbacValidator()

// Reactive validation
const issues = computed(() => validatePolicy(props.policy))

const stats = computed(() => ({
    Error: issues.value.filter(i => i.severity === 'Error').length,
    Warning: issues.value.filter(i => i.severity === 'Warning').length,
    Info: issues.value.filter(i => i.severity === 'Info').length,
}))

const hasIssues = computed(() => issues.value.length > 0)

const getBadgeColor = (severity: IssueSeverity) => {
    switch(severity) {
        case 'Error': return 'bg-red-100 text-red-700 border-red-200'
        case 'Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'Info': return 'bg-blue-50 text-blue-700 border-blue-200'
    }
}

const getIcon = (severity: IssueSeverity) => {
    switch(severity) {
        case 'Error': return AlertCircle
        case 'Warning': return AlertTriangle
        case 'Info': return Info
    }
}
</script>

<template>
    <div class="flex flex-col h-full bg-layer-01">
        <!-- Header Stats -->
        <div class="bg-layer-01 border-b border-border-subtle p-6">
            <h2 class="text-xl font-light text-text-primary mb-4">Policy Health Check</h2>
            <div class="grid grid-cols-3 gap-4">
                <div class="p-4 border border-red-200 bg-red-50/50 rounded-sm">
                    <div class="text-2xl font-bold text-red-700">{{ stats.Error }}</div>
                    <div class="text-xs uppercase tracking-wide text-red-600/80 font-bold">Errors</div>
                </div>
                <div class="p-4 border border-yellow-200 bg-yellow-50/50 rounded-sm">
                    <div class="text-2xl font-bold text-yellow-700">{{ stats.Warning }}</div>
                    <div class="text-xs uppercase tracking-wide text-yellow-600/80 font-bold">Warnings</div>
                </div>
                <div class="p-4 border border-blue-200 bg-blue-50/50 rounded-sm">
                    <div class="text-2xl font-bold text-blue-700">{{ stats.Info }}</div>
                    <div class="text-xs uppercase tracking-wide text-blue-600/80 font-bold">Suggestions</div>
                </div>
            </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto p-6 bg-background">
            <div v-if="hasIssues" class="flex flex-col gap-2 w-full">
                <div v-for="issue in issues" :key="issue.id" 
                     @click="issue.statementId && emit('navigate', issue.statementId)"
                     class="bg-layer-01 border border-border-subtle p-3 shadow-sm hover:shadow-md transition-all flex gap-3 items-start group rounded-sm cursor-pointer hover:border-interactive-01">
                    
                    <div class="mt-0.5">
                        <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1', getBadgeColor(issue.severity)]">
                             {{ issue.severity }}
                        </span>
                    </div>
                    
                    <div class="flex-1">
                        <div class="text-sm text-text-primary font-medium mb-0.5">{{ issue.message }}</div>
                        <div class="text-xs text-text-tertiary font-mono flex items-center gap-2">
                            {{ issue.path.join(' > ') }}
                        </div>
                    </div>

                    <button v-if="issue.statementId" 
                            class="text-xs font-bold text-interactive-01 hover:bg-layer-02 px-2 py-1 uppercase tracking-wide flex items-center gap-1 rounded">
                         <ArrowRight class="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div v-else class="h-full flex flex-col items-center justify-center text-text-tertiary">
                <div class="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                    <CheckCircle class="w-8 h-8" />
                </div>
                <p class="text-lg font-medium text-text-secondary">All checks passed!</p>
                <p class="text-sm">No logic inconsistencies found in this policy.</p>
            </div>
        </div>
    </div>
</template>
