/**
 * common.ts
 * Shared utility functions for ID generation and general helpers.
 */

export const createId = (): string => {
    return crypto.randomUUID()
}

export const createSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
}
