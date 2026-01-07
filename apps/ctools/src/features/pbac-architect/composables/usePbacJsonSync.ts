import { ref, watch, type Ref } from 'vue'
import type { FileSystemItem } from '../types'

/**
 * Manages bidirectional synchronization between the FileSystem state (tree)
 * and the Monaco Editor JSON text.
 * 
 * Includes debouncing to prevent parsing errors on every keystroke.
 */
export function usePbacJsonSync(items: Ref<FileSystemItem[]>) {
    const jsonCode = ref(JSON.stringify(items.value, null, 2))
    const jsonError = ref<string | null>(null)
    const isSyncing = ref(false)

    // Sync State -> JSON (One way, effectively)
    // We only update JSON if the state changed externally (not by the editor itself)
    watch(items, (newVal) => {
        if (isSyncing.value) return

        const currentStr = JSON.stringify(newVal, null, 2)
        if (currentStr !== jsonCode.value) {
            jsonCode.value = currentStr
        }
    }, { deep: true })

    // Validates and Applies JSON -> State
    const applyJsonToState = (val: string) => {
        try {
            const parsed = JSON.parse(val)

            // Basic Schema Validation (Check if array)
            if (!Array.isArray(parsed)) {
                throw new Error('Root must be an array of FileSystemItems')
            }

            // Lock sync to prevent loop
            isSyncing.value = true
            items.value = parsed
            jsonError.value = null

            // Unlock after tick
            setTimeout(() => {
                isSyncing.value = false
            }, 0)

        } catch (e: any) {
            jsonError.value = e.message
        }
    }

    // Debounced Handler for Editor Input
    let debounceTimer: ReturnType<typeof setTimeout>
    const handleJsonChange = (val: string) => {
        jsonCode.value = val // Update model immediately so typing isn't lagging

        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            applyJsonToState(val)
        }, 600) // 600ms debounce
    }

    return {
        jsonCode,
        jsonError,
        handleJsonChange
    }
}
