import pako from 'pako'

/**
 * Compresses data using Gzip and returns a Base64 string (without data URI prefix).
 * Synchronous version using btoa (good for small chunks).
 */
export const gzipAndBase64 = (data: string | Uint8Array): string => {
    const compressed = pako.gzip(data)
    let binary = ''
    const len = compressed.byteLength
    for (let i = 0; i < len; i++) {
        const byte = compressed[i]
        if (byte !== undefined) binary += String.fromCharCode(byte)
    }
    return btoa(binary)
}

/**
 * Async version using Blob and FileReader.
 * Matches legacy behavior perfectly and handles large files better without main thread blocking concerns during base64 conversion.
 */
export const gzipAndBase64Async = async (data: Uint8Array): Promise<string> => {
    const compressed = pako.gzip(data)
    const blob = new Blob([compressed], { type: 'application/gzip' })

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            const res = reader.result as string
            // remove data:application/gzip;base64,
            resolve(res.split(',')[1] || '')
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

/**
 * Decodes a Base64 string to a raw string, then unzips it.
 * Expects a Base64 encoded Gzip stream.
 */
export const base64AndGunzip = (base64: string): string => {
    const binaryString = atob(base64)
    const charData = binaryString.split('').map(x => x.charCodeAt(0))
    const binData = new Uint8Array(charData)
    // @ts-ignore
    return pako.inflate(binData, { to: 'string' })
}

/**
 * Chunks a string into lines of a specific length.
 */
export const chunkString = (str: string, length: number = 76): string => {
    return str.match(new RegExp('.{1,' + length + '}', 'g'))?.join('\n') || str
}
