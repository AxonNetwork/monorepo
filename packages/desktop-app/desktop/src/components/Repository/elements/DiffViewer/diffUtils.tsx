export function formatCell(cell: string) {
    if (cell.length < 32) {
        return cell
    }
    return (cell.substring(0, 29) + '...')
}