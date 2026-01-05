// Removed static pako import
// import pako from 'pako' 

/**
 * Async version using CompressionStream or Fallback.
 * Matches legacy behavior perfectly.
 */
export const gzipAndBase64Async = async (data: Uint8Array): Promise<string> => {
    // 1. Try Native CompressionStream (Chrome 80+, FF 113+) - blazingly fast 
    if ('CompressionStream' in window) {
        try {
            const stream = new Response(new Blob([data])).body?.pipeThrough(new CompressionStream('gzip'))
            if (stream) {
                const buffer = await new Response(stream).arrayBuffer()
                // Convert to base64 properly
                let binary = ''
                const bytes = new Uint8Array(buffer)
                const len = bytes.byteLength
                // Chunk to avoid stack overflow on massive images
                for (let i = 0; i < len; i += 1024) {
                    binary += String.fromCharCode(...bytes.subarray(i, i + 1024))
                }
                return btoa(binary)
            }
        } catch (e) {
            console.warn('Native compression failed, falling back to pako', e)
        }
    }

    // 2. Fallback to Dynamic Pako (Only load if absolutely needed)
    console.debug('Using Pako fallback (dynamically loaded)')
    const { default: pako } = await import('pako')
    
    const compressed = pako.gzip(data)
    let binary = ''
    const len = compressed.byteLength
    for (let i = 0; i < len; i += 1024) {
        binary += String.fromCharCode(...compressed.subarray(i, i + 1024))
    }
    return btoa(binary)
}

/**
 * Decodes a Base64 string to a raw string, then unzips it.
 * Uses dynamic import for pako inflate as well.
 */
export const base64AndGunzip = async (base64: string): Promise<string> => {
    const binaryString = atob(base64)
    const charData = binaryString.split('').map(x => x.charCodeAt(0))
    const binData = new Uint8Array(charData)
    
    // Dynamic import to keep main bundle light
    const { default: pako } = await import('pako')
    
    // @ts-ignore
    return pako.inflate(binData, { to: 'string' })
}

/**
 * Chunks a string into lines of a specific length.
 */
export const chunkString = (str: string, length: number = 76): string => {
    return str.match(new RegExp('.{1,' + length + '}', 'g'))?.join('\n') || str
}
