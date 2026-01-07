import { ref } from 'vue'
import type { Vocabulary } from '../types'

// Shared state for vocabulary (could be global or provided)
const defaultVocab: Vocabulary = {
    roles: ['role:admin', 'role:user', 'role:guest'],
    types: ['CeIncident', 'CeIssue', 'CeAsset'],
    properties: ['resource.type', 'resource.name', 'resource.owner', 'resource.id']
}

export const usePbacVocabulary = (initialVocab?: Vocabulary) => {
    const vocab = ref<Vocabulary>(initialVocab || defaultVocab)

    const comparisons = ['=', '!=', 'Contains', '!~', 'ContainsAny', 'NotContainsAny']
    const effects = ['Allow', 'Deny']
    const actions = ['Read', 'Update', 'Create', 'Delete']
    const logicTypes = ['Condition', 'All', 'Any', 'HasAccessTo']

    const getOptionsForPath = (path: string): string[] => {
        const lastKey = path.split('.').pop() || ''

        // --- Core Policy Fields ---
        if (lastKey === 'Subject' || path.includes('Subject')) return vocab.value.roles
        if (lastKey === 'Action' || path.includes('Action')) return actions
        if (lastKey === 'Effect' || path.includes('Effect')) return effects

        // --- Version (Explicitly NO dropdown, just text) ---
        if (lastKey === 'Version') return []

        // --- Condition Fields ---
        if (lastKey === 'Left' || path.includes('Left')) return vocab.value.properties
        if (lastKey === 'Comparison' || path.includes('Comparison')) return comparisons

        if (lastKey === 'Right' || path.includes('Right')) {
            // Right (Value) mapped to Types (plus primitives)
            return [
                ...vocab.value.types,
                'true', 'false', '0', '1'
            ]
        }

        // --- Reference Fields ---
        if (lastKey === 'Reference' || path.includes('Reference') || lastKey === 'accessReference') return vocab.value.properties
        if (lastKey === 'Role' || path.includes('Role') || lastKey === 'accessRole') return vocab.value.roles

        return []
    }

    return {
        vocab,
        comparisons,
        effects,
        actions,
        logicTypes,
        getOptionsForPath
    }
}
