import { ref } from 'vue'

export function usePbacContextMenu() {
    const renamingId = ref<string>('')

    const contextMenu = ref<{
        visible: boolean
        x: number
        y: number
        itemId: string
        itemType: 'Category' | 'Policy'
    }>({
        visible: false,
        x: 0,
        y: 0,
        itemId: '',
        itemType: 'Category'
    })

    const handleContextMenu = (e: MouseEvent, id: string, type: 'Category' | 'Policy') => {
        contextMenu.value = {
            visible: true,
            x: e.clientX,
            y: e.clientY,
            itemId: id,
            itemType: type
        }
    }

    const handleRequestRename = (id: string) => {
        renamingId.value = id
    }

    const handleStopRename = () => {
        renamingId.value = ''
    }

    const closeContextMenu = () => {
        contextMenu.value.visible = false
    }

    return {
        renamingId,
        contextMenu,
        handleContextMenu,
        handleRequestRename,
        handleStopRename,
        closeContextMenu
    }
}
