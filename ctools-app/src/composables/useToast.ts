import { ref } from 'vue'

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])
let idCounter = 0

export function useToast() {
    function add(message: string, type: 'success' | 'error' | 'info' = 'info') {
        const id = idCounter++
        const toast: Toast = { id, message, type }
        toasts.value.push(toast)

        setTimeout(() => {
            remove(id)
        }, 3000)
    }

    function remove(id: number) {
        const idx = toasts.value.findIndex(t => t.id === id)
        if (idx > -1) toasts.value.splice(idx, 1)
    }

    return { toasts, add, remove }
}
