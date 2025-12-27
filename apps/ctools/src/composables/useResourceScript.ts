import { gzipAndBase64Async, chunkString } from '../utils/gzip'
import { ScriptBuilder } from '../utils/ScriptBuilder'

export interface ResourceItem {
    id: string
    name: string
    mimeType: string
    data: Uint8Array | string // Uint8Array for binary, string for text (SVG)
}

export const useResourceScript = () => {

    const generateScript = async (
        items: ResourceItem[],
        targetVariable: string,
        comment: string = 'Generated Resource Script'
    ): Promise<string> => {
        const sb = new ScriptBuilder(comment)

        for (const item of items) {
            try {
                console.log('useResourceScript: Processing item', item.id, item.name)
                let base64: string

                if (typeof item.data === 'string') {
                    // Text content (SVG/XML) -> Convert to Uint8Array first or just compress string
                    const encoder = new TextEncoder()
                    const uint8 = encoder.encode(item.data)
                    base64 = await gzipAndBase64Async(uint8)
                } else {
                    // Binary content
                    base64 = await gzipAndBase64Async(item.data)
                }

                const chunked = chunkString(base64)

                sb.createObject(targetVariable, 'FileResource', {
                    id: item.id || undefined, // Ensure undefined if empty, but let's test propagation
                    name: item.name,
                    content: `${item.name};${item.mimeType};${chunked}`
                })
            } catch (err) {
                console.error(`Failed to process item ${item.name}`, err)
                sb.addComment(`ERROR processing ${item.name}: ${err}`)
            }
        }

        return sb.toString()
    }

    return {
        generateScript
    }
}
