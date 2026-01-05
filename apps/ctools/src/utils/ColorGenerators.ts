import tinycolor from 'tinycolor2'

export interface ColorItem {
    id?: string
    name: string
    hex: string
}

export const generateScale = (baseColor: string): ColorItem[] => {
    const base = tinycolor(baseColor)
    const baseHsl = base.toHsl()
    const colors: ColorItem[] = []

    // Material Design 2014-like generation logic
    // 500 is base. 
    // Lighter: Increase lightness, Decrease saturation slightly
    // Darker: Decrease lightness, Increase saturation slightly

    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

    steps.forEach(step => {
        let l = baseHsl.l
        let s = baseHsl.s

        if (step < 500) {
            // Lighter
            const f = (500 - step) / 450 // 0 to 1
            l = Math.min(1, l + f * (1 - l) * 0.9)
            s = Math.max(0, s - f * 0.1)
        } else if (step > 500) {
            // Darker
            const f = (step - 500) / 400 // 0 to 1
            l = Math.max(0, l - f * l * 0.8)
            s = Math.min(1, s + f * 0.1)
        }

        const hex = tinycolor({ h: baseHsl.h, s, l }).toHexString().toUpperCase()
        colors.push({ name: `Color ${step}`, hex })
    })

    return colors
}

export const generatePastel = (baseColor: string): ColorItem[] => {
    const base = tinycolor(baseColor)
    const h = base.toHsl().h
    const colors: ColorItem[] = []

    for (let i = 0; i < 6; i++) {
        // Rotate hue, low saturation, high lightness
        const hue = (h + (i * 60)) % 360
        const hex = tinycolor({ h: hue, s: 0.4, l: 0.8 }).toHexString().toUpperCase()
        colors.push({ name: `Pastel ${i + 1}`, hex })
    }
    return colors
}

export const generateShades = (baseColor: string): ColorItem[] => {
    const colors: ColorItem[] = []
    const count = 8
    for (let i = 0; i < count; i++) {
        const f = i / (count - 1)
        // Mix with black
        const hex = tinycolor.mix(baseColor, '#000000', f * 80).toHexString().toUpperCase()
        colors.push({ name: `Shade ${i + 1}`, hex })
    }
    return colors
}

export const generateInterpolate = (start: string, end: string, steps: number): ColorItem[] => {
    const colors: ColorItem[] = []
    // Use tinycolor.mix
    for (let i = 0; i < steps; i++) {
        const f = i / (steps - 1)
        const hex = tinycolor.mix(start, end, f * 100).toHexString().toUpperCase()
        colors.push({ name: `Step ${i + 1}`, hex })
    }
    return colors
}
export const generateHarmonies = (baseColor: string, type: 'complementary' | 'analogous' | 'triadic' | 'split' | 'tetradic'): ColorItem[] => {
    const color = tinycolor(baseColor)
    const colors: ColorItem[] = []

    // Helper
    const add = (c: any, suffix: string) => {
        colors.push({ name: `${type} ${suffix}`, hex: c.toHexString().toUpperCase() })
    }

    if (type === 'complementary') {
        add(color, 'Base')
        add(color.clone().complement(), 'Comp')
    } else if (type === 'analogous') {
        const ag = color.analogous()
        ag.forEach((c, i) => add(c, `${i + 1}`))
    } else if (type === 'triadic') {
        const tri = color.triad()
        tri.forEach((c, i) => add(c, `${i + 1}`))
    } else if (type === 'split') {
        const split = color.splitcomplement()
        split.forEach((c, i) => add(c, `${i + 1}`))
    } else if (type === 'tetradic') {
        const tet = color.tetrad()
        tet.forEach((c, i) => add(c, `${i + 1}`))
    }

    return colors
}

export const generateTailwindScale = (baseColor: string, count: number = 11): ColorItem[] => {
    // A heuristic approach to approximate Tailwind's 50-950 scale
    // We'll try to place the base color at the closest step and generate around it
    const base = tinycolor(baseColor)
    const hsl = base.toHsl()

    // Naive mapping: Lightness -> Step
    // 0.95 -> 50, 0.5 -> 500, 0.05 -> 950
    // We force the base color to stay as is, and generate others relative to it

    // If standard 11 steps, use standard keys
    let steps: number[] = []
    if (count === 11) {
        steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
    } else {
        // Generate steps 0 to count-1
        // We'll map them conceptually to 50..950 for algorithm consistency
        steps = Array.from({ length: count }, (_, i) => {
            // Map i (0..count-1) to 50..950 range
            const t = i / (count - 1)
            return Math.round(50 + t * 900)
        })
    }

    const colors: ColorItem[] = []

    steps.forEach(step => {
        let s = hsl.s

        // Define target lightness for this step
        // 50: 0.95, 500: 0.5, 900: 0.1, 950: 0.05
        let targetL = 0
        if (step <= 50) targetL = 0.95
        else if (step >= 950) targetL = 0.05
        else targetL = 1 - (step / 1000)

        // Enhance saturation for middle weights, desaturate for very light/dark
        // This gives that "Tailwind pop"
        let targetS = s
        if (step >= 400 && step <= 600) targetS = Math.min(1, s * 1.1) // Pop
        else if (step < 200 || step > 800) targetS = s * 0.8 // Muted ends

        // Mix the computed color with the base hue
        const generated = tinycolor({ h: hsl.h, s: targetS, l: targetL })

        colors.push({
            name: `${step}`,
            hex: generated.toHexString().toUpperCase()
        })
    })

    return colors
}

export const generateDataViz = (baseColor: string, count: number): ColorItem[] => {
    const base = tinycolor(baseColor)
    const h = base.toHsl().h
    const colors: ColorItem[] = []

    // Golden Angle approximation ~137.5 degrees
    const goldenAngle = 137.50776

    for (let i = 0; i < count; i++) {
        const hue = (h + (i * goldenAngle)) % 360
        // Vary lightness/saturation slightly to ensure distinction
        const l = 0.45 + (i % 3) * 0.1 // 0.45, 0.55, 0.65 cycle
        const s = 0.6 + (i % 2) * 0.2 // 0.6, 0.8 cycle

        const color = tinycolor({ h: hue, s, l })
        colors.push({ name: `Data ${i + 1}`, hex: color.toHexString().toUpperCase() })
    }

    return colors
}
