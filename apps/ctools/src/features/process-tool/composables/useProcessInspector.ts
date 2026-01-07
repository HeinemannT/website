import { ref, shallowRef } from 'vue'

export function useProcessInspector(modeler: any) {
    const inspectorVisible = ref(false)
    const inspectorTitle = ref('')
    const inspectorType = ref('')

    // Element helpers
    const isServiceTask = ref(false)
    const isUserTask = ref(false)
    const selectedElement = shallowRef<any>(null)

    // Form Props
    const props = ref({
        id: '',
        name: '',
        topic: '',
        formKey: '',
        roles: [] as { value: string, obj: any }[]
    })

    // UI Helpers
    const helper = ref({ script: '', variable: '' })

    const loadInspector = (element: any) => {
        if (!element) {
            inspectorVisible.value = false
            selectedElement.value = null
            return
        }

        selectedElement.value = element
        const bo = element.businessObject

        inspectorVisible.value = true
        inspectorTitle.value = bo.name || bo.id
        inspectorType.value = element.type
        isServiceTask.value = element.type === 'bpmn:ServiceTask'
        isUserTask.value = element.type === 'bpmn:UserTask'

        props.value.id = bo.id
        props.value.name = bo.name || ''

        // Reset extended props
        props.value.topic = ''
        props.value.formKey = ''
        props.value.roles = []
        helper.value = { script: '', variable: '' }

        if (isServiceTask.value) {
            props.value.topic = bo.topic || ''
            const parts = props.value.topic.split(';')
            if (parts.length >= 3) {
                helper.value.script = parts[1] || ''
                helper.value.variable = parts[2] || ''
            }
        }

        if (isUserTask.value) {
            props.value.formKey = bo.formKey || ''
            if (bo.extensionElements && bo.extensionElements.values) {
                const camProps = bo.extensionElements.values.find((e: any) => e.$type === 'camunda:Properties')
                if (camProps && camProps.values) {
                    props.value.roles = camProps.values
                        .filter((p: any) => p.name === 'role-participant')
                        .map((p: any) => ({ value: p.value, obj: p }))
                }
            }
        }
    }

    const updateProps = () => {
        if (!selectedElement.value || !modeler.value) return
        const modeling = modeler.value.get('modeling')
        let updates: any = { id: props.value.id, name: props.value.name }

        if (isServiceTask.value) {
            updates['camunda:topic'] = props.value.topic
            updates['camunda:type'] = 'external'
        }
        if (isUserTask.value) {
            updates['camunda:formKey'] = props.value.formKey
        }

        modeling.updateProperties(selectedElement.value, updates)
        inspectorTitle.value = props.value.name || props.value.id
    }

    const buildTopic = () => {
        if (helper.value.script || helper.value.variable) {
            const s = helper.value.script || 'null'
            const v = helper.value.variable || 'null'
            props.value.topic = `Extended;${s};${v}`
            updateProps()
        }
    }

    const addRole = () => {
        if (!selectedElement.value || !modeler.value) return
        const moddle = modeler.value.get('moddle')
        const modeling = modeler.value.get('modeling')
        const bo = selectedElement.value.businessObject

        let extensions = bo.extensionElements
        if (!extensions) {
            extensions = moddle.create('bpmn:ExtensionElements')
            modeling.updateProperties(selectedElement.value, { extensionElements: extensions })
        }

        let camProps = extensions.values.find((e: any) => e.$type === 'camunda:Properties')
        if (!camProps) {
            camProps = moddle.create('camunda:Properties')
            extensions.get('values').push(camProps)
        }

        const newProp = moddle.create('camunda:Property', {
            name: 'role-participant',
            value: 'newPropID'
        })
        camProps.get('values').push(newProp)
        loadInspector(selectedElement.value) // Reload to refresh list
    }

    const removeRole = (idx: number) => {
        if (!selectedElement.value || !modeler.value) return
        const modeling = modeler.value.get('modeling')
        const bo = selectedElement.value.businessObject
        const roleRef = props.value.roles[idx]?.obj
        if (!roleRef) return

        const camProps = bo.extensionElements?.values.find((e: any) => e.$type === 'camunda:Properties')
        if (camProps) {
            const values = camProps.get('values')
            const i = values.indexOf(roleRef)
            if (i > -1) {
                values.splice(i, 1)
                modeling.updateProperties(selectedElement.value, {
                    extensionElements: bo.extensionElements
                })
                loadInspector(selectedElement.value)
            }
        }
    }

    const updateRoles = () => {
        props.value.roles.forEach(role => {
            role.obj.value = role.value
        })
    }

    return {
        inspectorVisible,
        inspectorTitle,
        inspectorType,
        isServiceTask,
        isUserTask,
        props,
        helper,
        loadInspector,
        updateProps,
        buildTopic,
        addRole,
        removeRole,
        updateRoles
    }
}
