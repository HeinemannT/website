import { createDefaultCategory, createDefaultPolicy } from './usePbacUtils'
import type { Category, FileSystemItem } from '../types'
import { usePersistentState } from '@composables/usePersistentState'

export function usePbacFileSystem(initialItems: FileSystemItem[]) {
    // Optimization: shallowRef for large tree structures
    // OR investigate if usePersistentState can support shallow. 
    // For now, let's use usePersistentState for persistence, but be mindful of deep reactivity cost.
    // Actually, usePersistentState uses `ref` internally. For large trees, `shallowRef` + manual trigger is better.
    // But we need persistence. Let's stick to usePersistentState<FileSystemItem[]> for now as it's consistent.
    // If perf issues arise, we can switch to a custom shallow persistent state.

    const items = usePersistentState<FileSystemItem[]>('pbac:items', initialItems)

    const findItem = (id: string, list: FileSystemItem[] = items.value): FileSystemItem | undefined => {
        for (const item of list) {
            if (item.id === id) return item
            if (item.itemType === 'Category') {
                const found = findItem(id, (item as Category).children)
                if (found) return found
            }
        }
        return undefined
    }

    const updateItem = (updated: FileSystemItem, list: FileSystemItem[] = items.value): boolean => {
        for (let i = 0; i < list.length; i++) {
            if (list[i]!.id === updated.id) {
                list[i] = updated
                return true
            }
            if (list[i]!.itemType === 'Category') {
                if (updateItem(updated, (list[i] as Category).children)) return true
            }
        }
        return false
    }

    const deleteItem = (id: string, list: FileSystemItem[] = items.value): boolean => {
        for (let i = 0; i < list.length; i++) {
            if (list[i]!.id === id) {
                list.splice(i, 1)
                return true
            }
            if (list[i]!.itemType === 'Category') {
                if (deleteItem(id, (list[i] as Category).children)) return true
            }
        }
        return false
    }

    const addItem = (parentId: string, type: 'Category' | 'Policy', list: FileSystemItem[] = items.value): FileSystemItem | null => {
        for (const item of list) {
            if (item.id === parentId && item.itemType === 'Category') {
                const newItem = type === 'Category' ? createDefaultCategory() : createDefaultPolicy()
                    ; (item as Category).children.push(newItem)
                // Force reactivity if using shallowRef (though usePersistentState is deep ref)
                // If items was shallowRef: triggerRef(items)
                return newItem
            }
            if (item.itemType === 'Category') {
                const res = addItem(parentId, type, (item as Category).children)
                if (res) return res
            }
        }
        return null
    }

    const addRootItem = (type: 'Category' | 'Policy') => {
        const newItem = type === 'Category' ? createDefaultCategory() : createDefaultPolicy()
        items.value.push(newItem)
        return newItem
    }

    const toggleCategory = (id: string) => {
        const item = findItem(id)
        if (item && item.itemType === 'Category') {
            const cat = item as Category
            cat.collapsed = !cat.collapsed
        }
        // Force update if needed? Vue 3 ref should handle nested prop mutation if it's deep.
    }

    // Recursive helper to remove an item
    const removeItem = (id: string, list: FileSystemItem[]): FileSystemItem | null => {
        for (let i = 0; i < list.length; i++) {
            if (list[i]!.id === id) {
                return list.splice(i, 1)[0] || null
            }
            if (list[i]!.itemType === 'Category') {
                const res = removeItem(id, (list[i] as Category).children)
                if (res) return res
            }
        }
        return null
    }

    // Recursive helper to insert an item
    const insertItem = (item: FileSystemItem, targetId: string, position: 'before' | 'after' | 'inside', list: FileSystemItem[]): boolean => {
        // Special Case: Root Insertion (if targetId is root container equivalent, tricky here as we don't have explicit root ID)
        // Instead, we search for target

        for (let i = 0; i < list.length; i++) {
            const current = list[i]!

            // Match Target
            if (current.id === targetId) {
                if (position === 'before') {
                    list.splice(i, 0, item)
                    return true
                }
                if (position === 'after') {
                    list.splice(i + 1, 0, item)
                    return true
                }
                if (position === 'inside' && current.itemType === 'Category') {
                    (current as Category).children.push(item)
                    return true
                }
                return false
            }

            // Recurse
            if (current.itemType === 'Category') {
                if (insertItem(item, targetId, position, (current as Category).children)) return true
            }
        }
        return false
    }

    const moveItem = (movedId: string, targetId: string, position: 'before' | 'after' | 'inside') => {
        if (movedId === targetId) return // Can't move to self

        // 1. Find and remove
        const item = removeItem(movedId, items.value)
        if (!item) return

        // 2. Insert at new location
        const success = insertItem(item, targetId, position, items.value)

        // Fallback: If insertion failed (target not found), add back to root or handle error
        if (!success) {
            console.warn(`Target ${targetId} not found, re-adding to root end.`)
            items.value.push(item)
        }
    }

    return {
        items,
        findItem,
        updateItem,
        deleteItem,
        addItem,
        addRootItem,
        toggleCategory,
        moveItem,
        setItems: (newItems: FileSystemItem[]) => { items.value = newItems }
    }
}
