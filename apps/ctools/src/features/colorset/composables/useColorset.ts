import { ref, computed, watch } from 'vue'
import tinycolor from 'tinycolor2'
import { usePersistentState } from '@composables/usePersistentState'
import { ScriptBuilder } from '@utils/ScriptBuilder'
import {
    generateInterpolate,
    generateHarmonies,
    generateTailwindScale,
    generateDataViz
} from '../utils/ColorGenerators'
import { extractColors } from '../utils/ColorExtractor'
import { useToast } from '@composables/useToast'

export interface ColorStart {
    id: string
    name: string
    hex: string
}

export interface GeneratorOutput {
    name: string
    hex: string
}

export function useColorset() {
    const { add: toast } = useToast()

    // --- State ---
    const rootParentId = usePersistentState('colorset:rootParentId', 't.color_folder')
    const setName = usePersistentState('colorset:setName', 'New Palette')
    const setId = usePersistentState('colorset:setId', '')

    const palette = usePersistentState<ColorStart[]>('colorset:palette', [
        { id: '', name: 'Red', hex: '#EF4444' },
        { id: '', name: 'Yellow', hex: '#EAB308' },
        { id: '', name: 'Green', hex: '#22C55E' }
    ])

    const selectedIndex = ref(-1)

    // Editor State
    const currentHex = ref('#EF4444')
    const currentHue = ref(0)
    const currentSat = ref(100)
    const currentVal = ref(100)
    const currentRgb = ref({ r: 239, g: 68, b: 68 })

    // Generator State
    const genStrategy = ref<'scale' | 'harmony' | 'dataviz' | 'interpolate'>('scale')
    const genColors = ref<GeneratorOutput[]>([])

    // Generator Settings
    const harmonyType = ref<'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic'>('complementary')
    const datavizCount = ref(6)
    const scaleSteps = ref(11)

    // Interpolate State
    const interStart = ref('#EF4444')
    const interEnd = ref('#3B82F6')
    const interSteps = ref(5)

    // Import State
    const importContent = ref('')

    // --- Actions ---

    const setColorState = (hex: string) => {
        currentHex.value = hex
        const color = tinycolor(hex)
        const hsv = color.toHsv()
        currentHue.value = hsv.h
        currentSat.value = hsv.s * 100
        currentVal.value = hsv.v * 100
        const rgb = color.toRgb()
        currentRgb.value = { r: rgb.r, g: rgb.g, b: rgb.b }
    }

    const generatePreview = (activeTabValue?: string) => {
        // Optional optimization: pass activeTab to avoid calculation if not visible
        if (activeTabValue && activeTabValue !== 'generate') return

        genColors.value = []

        if (genStrategy.value === 'interpolate') {
            genColors.value = generateInterpolate(interStart.value, interEnd.value, interSteps.value)
            return
        }

        const selectedColor = palette.value[selectedIndex.value]
        if (selectedIndex.value === -1 || !selectedColor) return
        const base = selectedColor.hex

        if (genStrategy.value === 'scale') {
            genColors.value = generateTailwindScale(base, scaleSteps.value)
        } else if (genStrategy.value === 'harmony') {
            genColors.value = generateHarmonies(base, harmonyType.value)
        } else if (genStrategy.value === 'dataviz') {
            genColors.value = generateDataViz(base, datavizCount.value)
        }
    }

    const updateModel = () => {
        if (selectedIndex.value === -1) return
        const col = palette.value[selectedIndex.value]
        if (!col) return

        // Auto-rename if name looks like a previous hex
        if (col.name.startsWith('#') || col.name === col.hex) {
            col.name = currentHex.value
        }

        // Auto-update ID to match hex for consistency
        const safeHex = currentHex.value.replace('#', '')
        col.id = `color_${safeHex}`

        col.hex = currentHex.value
        generatePreview('generate') // force update preview if we are in generate tab (simplification: just call it)
    }

    const updateColorFromHex = (val: string) => {
        if (val.length === 7) {
            setColorState(val)
            updateModel()
        }
    }

    const updateColorFromHsv = () => {
        const color = tinycolor({ h: currentHue.value, s: currentSat.value / 100, v: currentVal.value / 100 })
        const hex = color.toHexString().toUpperCase()
        currentHex.value = hex
        const rgb = color.toRgb()
        currentRgb.value = { r: rgb.r, g: rgb.g, b: rgb.b }
        updateModel()
    }

    const updateColorFromRgb = () => {
        const color = tinycolor({ r: currentRgb.value.r, g: currentRgb.value.g, b: currentRgb.value.b })
        const hex = color.toHexString().toUpperCase()
        currentHex.value = hex
        const hsv = color.toHsv()
        currentHue.value = hsv.h
        currentSat.value = hsv.s * 100
        currentVal.value = hsv.v * 100
        updateModel()
    }

    const addColor = () => {
        const newHex = '#64748B'
        palette.value.push({
            id: '',
            name: 'Color Name',
            hex: newHex
        })
        selectedIndex.value = palette.value.length - 1
        return 'studio' // return recommended tab
    }

    const deleteColor = (idx: number) => {
        palette.value.splice(idx, 1)
        if (selectedIndex.value === idx) selectedIndex.value = -1
        else if (selectedIndex.value > idx) selectedIndex.value--
    }

    const commitGenerated = () => {
        genColors.value.forEach(g => {
            palette.value.push({
                id: 'color_' + g.hex.replace('#', '').toLowerCase(),
                name: g.name,
                hex: g.hex
            })
        })
        toast(`Added ${genColors.value.length} generated colors`, 'success')
        return 'studio'
    }

    const processPaste = () => {
        const extracted = extractColors(importContent.value)

        let count = 0
        extracted.forEach(c => {
            palette.value.push({
                id: 'color_' + c.hex.replace('#', '').toLowerCase(),
                name: c.name,
                hex: c.hex
            })
            count++
        })

        if (count > 0) {
            toast(`Imported ${count} colors`, 'success')
            importContent.value = ''
            return 'studio'
        } else {
            toast('No valid colors found', 'error')
            return null
        }
    }

    // --- Computed ---
    const scriptOutput = computed(() => {
        const sb = new ScriptBuilder(`Set: ${setName.value}`)
        sb.assignTarget('targetFolder', rootParentId.value)
        sb.addNewLine()

        const finalSetId = setId.value || ''

        sb.assignAdd('vSet', 'targetFolder', 'CorpoColorSet', {
            id: finalSetId,
            name: setName.value
        })
        sb.addNewLine()

        palette.value.forEach(col => {
            sb.createObject('vSet', 'CorpoColor', {
                id: col.id,
                name: col.name,
                color: col.hex
            })
        })
        return sb.toString()
    })

    // --- Watchers ---
    watch(selectedIndex, (newIdx) => {
        if (newIdx !== -1) {
            const col = palette.value[newIdx]
            if (col) {
                setColorState(col.hex)
                // Sync interpolate start if reasonable
                interStart.value = col.hex
                // We don't know activeTab here easily without passing it, 
                // but we can just let the view call generatePreview if needed, 
                // or we can expose a 'refresh' method.
                // For now, let's just trigger it, it's cheap enough or the view will call it.
                // Actually, let's NOT call generatePreview here to avoid side effects if tab is hidden.
                // The view can watch selectedIndex or we can rely on reactivity.
            }
        }
    })

    return {
        // State
        rootParentId,
        setName,
        setId,
        palette,
        selectedIndex,
        // Editor
        currentHex,
        currentHue,
        currentSat,
        currentVal,
        currentRgb,
        // Generator
        genStrategy,
        genColors,
        harmonyType,
        datavizCount,
        scaleSteps,
        interStart,
        interEnd,
        interSteps,
        importContent,

        // Methods
        setColorState,
        updateColorFromHex,
        updateColorFromHsv,
        updateColorFromRgb,
        // handleMatrixUpdate is UI specific, can be done in view using updateColorFromHsv
        updateModel,
        addColor,
        deleteColor,
        generatePreview,
        commitGenerated,
        processPaste,

        // Computed
        scriptOutput
    }
}
