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
