import { useStorage } from '@vueuse/core'

/**
 * Creates a reactive state that persists to localStorage.
 * Keys are automatically prefixed with 'ctools:v1:' to prevent collisions.
 * 
 * @param key Unique key for this state
 * @param initialValue Initial value if no storage exists
 */
export function usePersistentState<T>(key: string, initialValue: T) {
    const PREF_KEY = `ctools:v1:${key}`
    return useStorage<T>(PREF_KEY, initialValue)
}
