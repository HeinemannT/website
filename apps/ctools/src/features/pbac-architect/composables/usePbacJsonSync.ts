import { ref, watch, type Ref } from 'vue'
import type { FileSystemItem } from '../types'

/**
 * Manages bidirectional synchronization between the FileSystem state (tree)
 * and the Monaco Editor JSON text.
 * 
 * Includes debouncing to prevent parsing errors on every keystroke.
 */
/**
 * Manages bidirectional synchronization between the FileSystem state (tree)
 * and the Monaco Editor JSON text.
 * 
 * Optimized: Only synchronizes when isActive is true to prevent
 * excessive JSON.stringify on the main thread during normal editing.
 */
export function usePbacJsonSync(items: Ref<FileSystemItem[]>, isActive: Ref<boolean>) {
    const jsonCode = ref('')
    const jsonError = ref<string | null>(null)
    const isSyncing = ref(false)

    // Sync State -> JSON (Lazily or when active)
    watch(items, (newVal) => {
        if (!isActive.value) return // Skip if tab not active
        if (isSyncing.value) return

        const currentStr = JSON.stringify(newVal, null, 2)
        if (currentStr !== jsonCode.value) {
            jsonCode.value = currentStr
        }
    }, { deep: true })

    // When becoming active, force a refresh
    watch(isActive, (val) => {
        if (val) {
            jsonCode.value = JSON.stringify(items.value, null, 2)
        }
    }, { immediate: true })

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
