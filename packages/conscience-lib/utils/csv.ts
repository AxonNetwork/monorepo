
export function parseCSV(contents: string|null|undefined) {
    if (!contents) {
        return []
    }

    const lines = contents.split('\n')
    const data = lines.map(line => line.split(','))
    return data
}