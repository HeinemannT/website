export function useDownload() {
    function downloadBlob(content: string | Blob, filename: string, mimeType = 'text/plain') {
        let blob: Blob
        if (typeof content === 'string') {
            blob = new Blob([content], { type: mimeType })
        } else {
            blob = content
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return { downloadBlob }
}
