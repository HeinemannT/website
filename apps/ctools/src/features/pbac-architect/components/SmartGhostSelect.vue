<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { X, Check } from 'lucide-vue-next'

// Generic Type Support not fully available in script setup defineProps without localized type definition in strict mode often
// defaulting to any for value/options to mimic legacy behavior
const props = withDefaults(defineProps<{
    modelValue: any
    options?: any[]
    isMulti?: boolean
    allowCustom?: boolean
    placeholder?: string
    autoFocus?: boolean
    className?: string
    inputClassName?: string
    immediate?: boolean
    displayMode?: 'chips' | 'text' // New prop for Text-Only Multi Select
}>(), {
    options: () => [],
    isMulti: false,
    allowCustom: false,
    immediate: false,
    className: '',
    inputClassName: '',
    displayMode: 'chips'
})

const emit = defineEmits<{
    (e: 'update:modelValue', val: any): void
    (e: 'blur'): void
}>()

const isOpen = ref(false)
const highlightedIndex = ref(0)
const dropdownStyle = ref<Record<string, string>>({})

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)

// Values
const safeValueString = (v: any) => {
    if (v === null || v === undefined) return ''
    return String(v)
}

const inputValue = ref('')
const multiSearch = ref('')

const selectedValues = computed(() => {
    if (Array.isArray(props.modelValue)) return props.modelValue.map(safeValueString)
    return (props.modelValue !== null && props.modelValue !== undefined) ? [safeValueString(props.modelValue)] : []
})

// Sync inputValue with modelValue
watch(() => props.modelValue, (val) => {
    if (!props.isMulti) {
        inputValue.value = safeValueString(val)
    } else if (props.displayMode === 'text') {
        // In Text mode, the input displays the CSV list when not searching
        // We only update if NOT typing to avoid cursor jumps, OR if we force sync
        if (!isOpen.value || multiSearch.value === '') {
             inputValue.value = selectedValues.value.join(', ')
        }
    }
}, { immediate: true, deep: true })

const filterText = computed(() => {
    if (props.isMulti) return multiSearch.value
    return props.allowCustom ? inputValue.value : ''
})

// Normalization
interface SelectOption {
    label: string
    value: any
}

const normalizedOptions = computed<SelectOption[]>(() => {
    return props.options.map(opt => {
        if (typeof opt === 'object' && opt !== null && 'label' in opt && 'value' in opt) {
            return opt as SelectOption
        }
        return { label: String(opt), value: opt }
    })
})

const filteredOptions = computed<SelectOption[]>(() => {
    const text = (filterText.value || '').toLowerCase()
    
    // Check match on label
    const isUnchanged = !props.isMulti && text === safeValueString(props.modelValue).toLowerCase()
    const isMultiTextIdle = props.isMulti && props.displayMode === 'text' && text === ''

    // If just opening or unchanged, show all
    if (isUnchanged || isMultiTextIdle || text === '') {
        return normalizedOptions.value
    }

    return normalizedOptions.value.filter(opt => {
        const matchLabel = opt.label.toLowerCase().includes(text)
        // In 'text' mode, we show selected items in the list (so they can be unchecked)
        // In 'chips' mode, we typically hide them, but let's allow showing them if we want toggle behavior there too.
        // For now, keep 'chips' behavior (hide selected) unless changed, but 'text' mode definitely needs to show them.
        const notSelected = props.isMulti && props.displayMode === 'chips' ? !selectedValues.value.includes(String(opt.value)) : true
        return matchLabel && notSelected
    })
})

const updatePosition = () => {
    if (isOpen.value && containerRef.value) {
        const rect = containerRef.value.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        
        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top
        
        const itemHeight = 32
        const contentHeight = (filteredOptions.value.length || 0) * itemHeight + 40
        const maxHeight = Math.min(contentHeight, 300)

        // Determine if top or bottom
        let placeTop = false
        if (spaceBelow < Math.min(maxHeight, 150) && spaceAbove > spaceBelow) {
            placeTop = true
        }

        let left = rect.left
        const minW = Math.max(rect.width, 240)
        
        if (left + minW > viewportWidth - 10) {
            left = viewportWidth - minW - 10
        }

        dropdownStyle.value = {
            top: placeTop ? 'auto' : `${rect.bottom}px`,
            bottom: placeTop ? `${viewportHeight - rect.top}px` : 'auto',
            left: `${left}px`,
            width: `${minW}px`,
            maxHeight: '300px'
        }
    }
}

// Event Listeners
const handleClickOutside = (e: MouseEvent) => {
    if (!isOpen.value) return
    const target = e.target as Node
    if (containerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return
    commitAndClose()
}

onMounted(() => {
    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    
    if (props.autoFocus) {
        setTimeout(() => inputRef.value?.focus(), 0)
    }
})

onUnmounted(() => {
    window.removeEventListener('mousedown', handleClickOutside)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
})

watch([isOpen, filteredOptions], async () => {
    if (isOpen.value) {
        await nextTick()
        updatePosition()
    } else {
        highlightedIndex.value = 0
    }
})

const commitAndClose = (specificValue?: string) => {
    isOpen.value = false
    
    if (specificValue !== undefined) {
        // Single Select Commit
        emit('update:modelValue', specificValue)
    } 
    else if (props.allowCustom && !props.isMulti) {
        const currentStr = safeValueString(props.modelValue)
        if (inputValue.value !== currentStr) emit('update:modelValue', inputValue.value)
    }
    else if (props.isMulti) {
        // Reset search on close
        multiSearch.value = ''
        if (props.displayMode === 'text') {
             inputValue.value = selectedValues.value.join(', ')
        }
    }
    else {
        // Reset to original if cancelled
        inputValue.value = safeValueString(props.modelValue)
    }
    
    emit('blur')
}

const addMultiValue = (val: string) => {
    if (selectedValues.value.includes(val)) return // No duplicates
    const newArr = [...selectedValues.value, val]
    emit('update:modelValue', newArr)
    multiSearch.value = ''
    isOpen.value = true
    nextTick(() => inputRef.value?.focus())
}

const removeMultiValue = (val: string) => {
    emit('update:modelValue', selectedValues.value.filter(v => v !== val))
    nextTick(() => inputRef.value?.focus())
}

const toggleMultiValue = (val: string) => {
    if (selectedValues.value.includes(val)) {
        removeMultiValue(val)
    } else {
        addMultiValue(val)
    }
    // For text mode, we want to keep focus but clear search?
    // User requested "Dropdown doesn't instantly go away".
    // add/remove already keep focus.
}

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        isOpen.value = false
        if (!props.isMulti) inputValue.value = safeValueString(props.modelValue)
        else if (props.displayMode === 'text') inputValue.value = selectedValues.value.join(', ')
        
        emit('blur')
        inputRef.value?.blur()
        return
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        if (!isOpen.value) isOpen.value = true
        else highlightedIndex.value = Math.min(highlightedIndex.value + 1, (filteredOptions.value.length || 0) + (props.allowCustom ? 0 : -1))
        return
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault()
        if (!isOpen.value) isOpen.value = true
        else highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
        return
    }

    if (e.key === 'Enter') {
        e.preventDefault()
        if (!isOpen.value) {
            isOpen.value = true 
            return
        }

        if (filteredOptions.value.length > 0 && highlightedIndex.value < filteredOptions.value.length) {
            const selected = filteredOptions.value[highlightedIndex.value]
            if (selected) {
                props.isMulti ? toggleMultiValue(String(selected.value)) : commitAndClose(String(selected.value))
            }
        } 
        else if (props.allowCustom && (props.isMulti ? multiSearch.value : inputValue.value)) {
            const val = props.isMulti ? multiSearch.value : inputValue.value
            props.isMulti ? addMultiValue(val) : commitAndClose()
        }
    }
    
    // Backspace logic
    if (e.key === 'Backspace' && props.isMulti) {
        // If chips, logic is remove last if empty.
        // If text, logic: if search is empty, remove last?
        // But in text mode, 'inputValue' might be full string if not searching.
        // We only remove last if we are in "Search" mode (empty input) and hit backspace? 
        // Or standard text editing applies? Standard text editing is better if user sees full string.
        // But here we might be switching between "View Mode" string and "Search Mode" string.
        if (props.displayMode === 'chips' && multiSearch.value === '' && selectedValues.value.length > 0) {
            const val = selectedValues.value[selectedValues.value.length - 1]
            if (val) removeMultiValue(val)
        }
    }
}

const handleInputChange = (e: Event) => {
    const val = (e.target as HTMLInputElement).value
    if (props.isMulti) {
        multiSearch.value = val
        // In text mode, if they type, we treat it as search.
        // But visually, the input value is now 'val'.
        if (props.displayMode === 'text') inputValue.value = val
    }
    else {
        inputValue.value = val
        if (props.allowCustom && props.immediate) emit('update:modelValue', val)
    }
    isOpen.value = true
}

// User Interaction: Click -> Open + Select All
const handleInteraction = (e: FocusEvent | MouseEvent) => {
    isOpen.value = true
    
    // Select All Logic
    const target = e.target as HTMLInputElement
    
    if (props.displayMode === 'text' || (!props.isMulti && props.allowCustom)) {
        // For text mode multi, we also want to select all effectively? 
        // Or if they click, we clear and let them search?
        // User said: "Text remains text".
        // Usually clicking "TypeA, TypeB" -> Selects "TypeA, TypeB". 
        // If they type, it replaces (standard input behavior).
        // If they just want to open dropdown, they click.
        
        requestAnimationFrame(() => {
            target.select()
        })
    }
}

</script>

<template>
    <!-- Multi Select (Chips Mode) -->
    <div v-if="isMulti && displayMode === 'chips'"
        ref="containerRef"
        class="flex flex-wrap items-center gap-1.5 p-1 min-h-[32px] cursor-text bg-transparent border border-transparent transition-all h-auto w-full content-start"
        :class="className"
        @click="isOpen = true; inputRef?.focus()"
    >
        <span v-for="val in selectedValues" :key="val" class="bg-layer-03 text-text-primary text-[12px] px-2 h-[20px] rounded-sm flex items-center select-none border border-border-subtle">
            <span class="max-w-[200px] truncate font-medium">{{ val }}</span>
            <button 
                @mousedown.prevent.stop="removeMultiValue(val)" 
                class="ml-1 text-text-tertiary hover:text-red-500 flex items-center justify-center w-4 h-4"
            >
                <X class="w-3 h-3" />
            </button>
        </span>
        <div class="flex-1 min-w-[60px] relative h-[20px]">
            <input
                ref="inputRef"
                class="absolute inset-0 w-full bg-transparent outline-none m-0 p-0 border-0 text-sm font-mono text-text-primary placeholder-text-tertiary"
                :class="inputClassName"
                :value="multiSearch"
                @input="handleInputChange"
                @keydown="handleKeyDown"
                @focus="handleInteraction"
                @click="handleInteraction"
                @blur="() => { if(!isOpen) emit('blur') }"
                :placeholder="selectedValues.length === 0 ? placeholder : ''"
                autocomplete="off"
            />
        </div>
    </div>

    <!-- Single Select OR Multi Select Text Mode -->
    <div v-else ref="containerRef" class="relative grid h-full items-center" :class="className">
        <!-- Invisible span for auto-width functionality -->
        <span class="col-start-1 row-start-1 opacity-0 whitespace-pre pointer-events-none select-none overflow-hidden" :class="inputClassName">
            {{ inputValue || placeholder || ' ' }}
        </span>
        <input
            ref="inputRef"
            class="col-start-1 row-start-1 w-full h-full bg-transparent border-0 outline-none p-0 m-0 text-text-primary placeholder-text-tertiary transition-colors"
            style="color: inherit; background: transparent;"
            :class="[inputClassName, !allowCustom ? 'cursor-pointer select-none' : '']"
            :value="inputValue"
            @input="handleInputChange"
            @click="handleInteraction"
            @mousedown.prevent="handleInteraction"
            @focus="handleInteraction"
            @keydown="handleKeyDown"
            :placeholder="placeholder"
            :readonly="!allowCustom && !isMulti" 
            autocomplete="off"
        />
    </div>

    <!-- Dropdown Portal -->
    <Teleport to="body">
        <div v-if="isOpen"
            ref="dropdownRef"
            class="fixed z-[9999] bg-layer-02 border border-border-strong shadow-xl text-[13px] overflow-y-auto flex flex-col rounded-sm min-w-[200px]"
            :style="dropdownStyle"
            @mousedown.prevent
        >
            <template v-if="filteredOptions.length > 0">
                <div v-for="(opt, idx) in filteredOptions" :key="String(opt.value)"
                    @click.stop="isMulti ? toggleMultiValue(String(opt.value)) : commitAndClose(String(opt.value))"
                    class="px-3 py-1.5 cursor-pointer border-b border-border-subtle last:border-0 truncate flex items-center justify-between transition-colors font-mono"
                    :class="idx === highlightedIndex ? 'bg-interactive-01 text-white' : 'text-text-secondary hover:bg-layer-03'"
                    @mouseenter="highlightedIndex = idx"
                >
                    <span>{{ opt.label }}</span>
                    <!-- Multi-Select Check Indicator -->
                    <Check v-if="isMulti && selectedValues.includes(String(opt.value))" class="w-3.5 h-3.5" :class="idx === highlightedIndex ? 'text-white' : 'text-interactive-01'" />
                </div>
            </template>
            <div v-else class="px-3 py-1.5 text-text-tertiary italic select-none">No matches</div>

            <!-- Create Custom Option -->
            <div v-if="allowCustom && (isMulti ? multiSearch : inputValue) && !filteredOptions.some(o => o.label === (isMulti ? multiSearch : inputValue))"
                 @click.stop="isMulti ? addMultiValue(multiSearch) : commitAndClose()"
                 class="px-3 py-1.5 cursor-pointer border-t border-border-strong italic font-mono"
                 :class="highlightedIndex === filteredOptions.length ? 'bg-interactive-01 text-white' : 'text-interactive-01 hover:bg-layer-03'"
                 @mouseenter="highlightedIndex = filteredOptions.length"
            >
                 Use "{{ isMulti ? multiSearch : inputValue }}"
            </div>
        </div>
    </Teleport>
</template>
