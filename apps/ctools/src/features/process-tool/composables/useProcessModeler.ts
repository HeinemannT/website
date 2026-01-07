import { ref, shallowRef, nextTick } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import { usePersistentState } from '@composables/usePersistentState'
import { camundaModdleDescriptor } from '@config/camundaModdle'

export function useProcessModeler() {
    // const { add: toast } = useToast()

    const modeler = shallowRef<any>(null)
    const xmlContent = usePersistentState('process:xmlContent', '')
    const hasDiagram = ref(false)
    const statusMsg = ref('')
    const statusType = ref<'info' | 'error'>('info')

    // Internal state to prevent loop updates
    const isInternalUpdate = ref(false)

    // Events
    const onSelectionChanged = ref<((element: any) => void) | null>(null)

    const initModeler = (container: string) => {
        const canvas = document.querySelector(container)
        if (!canvas) return

        modeler.value = new BpmnModeler({
            container: container,
            keyboard: { bindTo: window },
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            }
        })

        // Hook into command stack to auto-save to XML
        modeler.value.on('commandStack.changed', async () => {
            try {
                const { xml } = await modeler.value.saveXML({ format: true })
                isInternalUpdate.value = true
                xmlContent.value = xml
                isInternalUpdate.value = false
            } catch (err) {
                console.error(err)
            }
        })

        // Hook into selection
        modeler.value.on('selection.changed', (e: any) => {
            const selection = e.newSelection
            const el = selection.length === 1 ? selection[0] : null
            if (onSelectionChanged.value) {
                onSelectionChanged.value(el)
            }
        })

        // Initial Load
        if (xmlContent.value) {
            renderDiagram(xmlContent.value).catch(() => {
                hasDiagram.value = false
            })
        }
    }

    const renderDiagram = async (xml: string) => {
        try {
            await modeler.value.importXML(xml)
            hasDiagram.value = true

            // Wait for render
            await nextTick()
            const canvas = modeler.value.get('canvas')
            canvas.zoom('fit-viewport')
        } catch (err) {
            statusMsg.value = 'Invalid BPMN XML'
            statusType.value = 'error'
        }
    }

    const createNewDiagram = async () => {
        try {
            await modeler.value.createDiagram()
            hasDiagram.value = true
            statusMsg.value = 'Created new diagram'
            statusType.value = 'info'
            // Force update XML
            const { xml } = await modeler.value.saveXML({ format: true })
            xmlContent.value = xml
        } catch (err) {
            console.error('Error creating diagram', err)
            statusMsg.value = 'Error creating diagram'
            statusType.value = 'error'
        }
    }

    const clearAll = () => {
        if (modeler.value) modeler.value.clear()
        hasDiagram.value = false
        xmlContent.value = ''
        statusMsg.value = 'Reset complete'
        statusType.value = 'info'
    }

    return {
        modeler,
        xmlContent,
        hasDiagram,
        statusMsg,
        statusType,
        isInternalUpdate,
        initModeler,
        renderDiagram,
        createNewDiagram,
        clearAll,
        onSelectionChanged
    }
}
