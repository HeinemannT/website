import { useClipboard as useVueUseClipboard } from '@vueuse/core'
import { useToast } from './useToast'

export function useClipboard() {
    const { copy: copyToClipboard, isSupported } = useVueUseClipboard()
    const { add: toast } = useToast()

    async function copy(text: string, label = 'Content') {
        if (isSupported.value) {
            await copyToClipboard(text)
            toast(`${label} copied to clipboard`, 'success')
            return true
        } else {
            // Fallback
            try {
                const textarea = document.createElement('textarea')
                textarea.value = text
                textarea.style.position = 'fixed'
                textarea.style.left = '-9999px'
                document.body.appendChild(textarea)
                textarea.select()
                document.execCommand('copy')
                document.body.removeChild(textarea)
                toast(`${label} copied to clipboard`, 'success')
                return true
            } catch (err) {
                toast(`Failed to copy ${label}`, 'error')
                console.error(err)
                return false
            }
        }
    }

    return { copy }
}
