import { ref, nextTick } from 'vue'
import { useToast } from './useToast'

export function useSvgTuner() {
    const { add: toast } = useToast()

    const svgCode = ref('')
    const colors = ref<{ original: string, val: string }[]>([])
    const dimensions = ref({ width: '', height: '' })
    const zoom = ref(0.8)
    const optimizationStats = ref('')
    const baseViewBox = ref<{ x: number, y: number, w: number, h: number } | null>(null)
    const paddingVal = ref(0)
    const activeTab = ref<'tune' | 'code'>('tune')

    const analyzeSVG = () => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgCode.value, "image/svg+xml")

        const svgEl = doc.querySelector('svg')
        if (svgEl) {
            dimensions.value.width = svgEl.getAttribute('width') || ''
            dimensions.value.height = svgEl.getAttribute('height') || ''

            // If no explicit w/h, try to get from viewBox
            if (!dimensions.value.width || !dimensions.value.height) {
                const vb = svgEl.getAttribute('viewBox')
                if (vb) {
                    const parts = vb.split(/[\s,]+/).map(Number)
                    if (parts.length === 4) {
                        if (!dimensions.value.width) dimensions.value.width = parts[2]!.toString()
                        if (!dimensions.value.height) dimensions.value.height = parts[3]!.toString()
                    }
                }
            }
        }

        const foundColors = new Set<string>()
        const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT)
        while (walker.nextNode()) {
            const el = walker.currentNode as Element
            ['fill', 'stroke'].forEach(attr => {
                const val = el.getAttribute(attr)
                if (val && val !== 'none' && !val.startsWith('url(')) foundColors.add(val)
            })
            const style = (el as HTMLElement).style
            if (style) {
                if (style.fill && style.fill !== 'none') foundColors.add(style.fill)
                if (style.stroke && style.stroke !== 'none') foundColors.add(style.stroke)
            }
        }

        const newColors = Array.from(foundColors)
        const preserved = newColors.map(c => {
            const existing = colors.value.find(ex => ex.original === c || ex.val === c)
            return existing ? existing : { original: c, val: c }
        })

        preserved.sort((a, b) => a.original.localeCompare(b.original))
        colors.value = preserved
    }

    const updateColor = (original: string, newVal: string) => {
        let newCode = svgCode.value
        const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const safeOriginal = escapeRegExp(original);

        newCode = newCode.replace(new RegExp(`="${safeOriginal}"`, 'g'), `="${newVal}"`)
        newCode = newCode.replace(new RegExp(`: ${safeOriginal}`, 'g'), `: ${newVal}`)
        newCode = newCode.replace(new RegExp(`:${safeOriginal}`, 'g'), `:${newVal}`)

        svgCode.value = newCode

        const cIndex = colors.value.findIndex(c => c.original === original)
        if (cIndex !== -1 && colors.value[cIndex]) {
            colors.value[cIndex]!.val = newVal
            colors.value[cIndex]!.original = newVal
        }
    }

    const optimizeSVG = () => {
        const originalSize = new Blob([svgCode.value]).size
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
        const clean = (node: Node) => {
            const children = Array.from(node.childNodes)
            for (const child of children) {
                if (child.nodeType === Node.COMMENT_NODE) {
                    node.removeChild(child)
                } else if (child.nodeType === Node.TEXT_NODE) {
                    if (!child.textContent?.trim()) {
                        node.removeChild(child)
                    } else {
                        child.textContent = child.textContent.trim()
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    clean(child)
                }
            }
        }
        const svgRoot = doc.querySelector('svg')
        if (svgRoot) clean(svgRoot)
        let result = new XMLSerializer().serializeToString(doc)
        result = result.replace(/>\s+</g, '><')
        svgCode.value = result

        nextTick(() => {
            const newSize = new Blob([svgCode.value]).size
            const saved = ((originalSize - newSize) / 1024).toFixed(2)
            optimizationStats.value = `Saved ${saved} KB`
            toast(`Safely reduced size by ${saved} KB`, 'success')
            analyzeSVG()
        })
    }

    const updateDimensions = () => {
        const parser = new DOMParser()
        const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
        const svgEl = doc.querySelector('svg')
        if (svgEl) {
            if (dimensions.value.width) svgEl.setAttribute('width', dimensions.value.width)
            if (dimensions.value.height) svgEl.setAttribute('height', dimensions.value.height)
            svgCode.value = new XMLSerializer().serializeToString(doc)
        }
    }

    const autoCrop = () => {
        const container = document.getElementById('svg-render-target')
        const svgEl = container ? container.querySelector('svg') : null
        if (!svgEl) return
        try {
            const bbox = svgEl.getBBox()
            const x = Math.floor(bbox.x)
            const y = Math.floor(bbox.y)
            const w = Math.ceil(bbox.width)
            const h = Math.ceil(bbox.height)
            const newVB = `${x} ${y} ${w} ${h}`

            const parser = new DOMParser()
            const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
            const domSvg = doc.querySelector('svg')
            if (domSvg) {
                domSvg.setAttribute('viewBox', newVB)
                domSvg.setAttribute('width', w.toString())
                domSvg.setAttribute('height', h.toString())
                dimensions.value.width = w.toString()
                dimensions.value.height = h.toString()
                svgCode.value = new XMLSerializer().serializeToString(doc)
                baseViewBox.value = { x, y, w, h }
                paddingVal.value = 0
                toast('ViewBox snapped to content', 'success')
            }
        } catch (e) {
            toast('Could not calculate bounding box. Ensure SVG is rendered.', 'error')
        }
    }

    const importFromUrl = async (url: string) => {
        try {
            const res = await fetch(url)
            if (!res.ok) throw new Error('Failed to fetch URL')
            const text = await res.text()
            if (!text.trim().startsWith('<svg') && !text.includes('<svg')) {
                throw new Error('URL does not return a valid SVG')
            }
            svgCode.value = text
            // Try to deduce name from URL
            const parts = url.split('/')
            const last = parts[parts.length - 1]
            return last?.split('.')[0] || 'imported-svg'
        } catch (e: any) {
            toast(e.message, 'error')
            return null
        }
    }

    const applyPadding = () => {
        if (!baseViewBox.value) {
            // Initiate base if missing
            const parser = new DOMParser()
            const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
            const svgEl = doc.querySelector('svg')
            if (svgEl) {
                const vb = svgEl.getAttribute('viewBox')
                if (vb) {
                    const parts = vb.split(/[\s,]+/).map(Number)
                    if (parts.length === 4) baseViewBox.value = { x: parts[0]!, y: parts[1]!, w: parts[2]!, h: parts[3]! }
                }
            }
        }

        if (!baseViewBox.value) return

        const pPercent = paddingVal.value / 100
        const b = baseViewBox.value

        // Calculate padding amount based on the largest dimension for uniformity
        const baseSize = Math.max(b.w, b.h)
        const pAmount = baseSize * pPercent

        const newX = b.x - pAmount
        const newY = b.y - pAmount
        const newW = b.w + (pAmount * 2)
        const newH = b.h + (pAmount * 2)
        const newVB = `${newX} ${newY} ${newW} ${newH}`

        const parser = new DOMParser()
        const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
        const domSvg = doc.querySelector('svg')
        if (domSvg) {
            domSvg.setAttribute('viewBox', newVB)
            svgCode.value = new XMLSerializer().serializeToString(doc)
        }
    }

    return {
        svgCode,
        colors,
        dimensions,
        zoom,
        optimizationStats,
        paddingVal,
        activeTab,
        analyzeSVG,
        updateColor,
        optimizeSVG,
        updateDimensions,
        autoCrop,
        applyPadding,
        importFromUrl
    }
}
