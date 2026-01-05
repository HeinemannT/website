import tinycolor from 'tinycolor2'

export interface ExtractedColor {
    original: string
    name: string
    hex: string
}

/**
 * Robustly extracts colors from any text string.
 * Supports: 
 * - Hex Codes (3, 4, 6, 8 digits)
 * - RGB/RGBA functions
 * - HSL/HSLA functions
 * - Named colors (strict validation)
 */
export function extractColors(text: string): ExtractedColor[] {
    const findings: { original: string, color: tinycolor.Instance }[] = []

    // 1. Hex Regex
    // Matches #123, #1234, #123456, #12345678, ensuring word boundaries
    const hexRegex = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g

    // 2. Functional Regex (rgb, rgba, hsl, hsla)
    // Matches rgb(r, g, b), rgba(r,g,b,a), etc. allowing for spaces and numbers/%
    const funcRegex = /(?:rgb|hsl)a?\s*\([^)]+\)/gi

    // 3. Collect Hex matches
    let match
    while ((match = hexRegex.exec(text)) !== null) {
        findings.push({ original: match[0], color: tinycolor(match[0]) })
    }

    // 4. Collect Functional matches
    while ((match = funcRegex.exec(text)) !== null) {
        findings.push({ original: match[0], color: tinycolor(match[0]) })
    }

    // 5. Scan for Named Colors (e.g. "red", "blue", "DarkOliveGreen")
    // We split by non-word characters to isolate potential names
    const words = text.split(/[^a-zA-Z]+/)
    const commonFalsePositives = new Set([
        'transparent', 'currentColor', 'inherit', 'initial', 'unset',
        'constructor', 'prototype', 'toString', 'valueOf'
    ])

    words.forEach(w => {
        if (!w || w.length < 3) return // Skip very short words
        if (commonFalsePositives.has(w)) return

        // Tinycolor is permissive, let's verify it's strictly a named format
        const c = tinycolor(w)
        if (c.isValid() && c.getFormat() === 'name') {
            findings.push({ original: w, color: c })
        }
    })

    // 6. Deduplicate and Formatting
    const unique = new Map<string, string>() // hex -> original_name
    const result: ExtractedColor[] = []

    findings.forEach(f => {
        if (f.color.isValid()) {
            const hex = f.color.toHexString().toUpperCase()

            // If duplicate, we keep the first occurrence
            if (!unique.has(hex)) {
                unique.set(hex, f.original)

                // Determine a nice name:
                // If the original was a name (e.g. "Red"), use it.
                // If it was a code, use the formatted Hex as name, or maybe the code itself?
                // Let's use the code found as the default name.
                result.push({
                    original: f.original,
                    name: f.original,
                    hex: hex
                })
            }
        }
    })

    return result
}
