export function formatCell(cell){
    if(cell.length < 32){
        return cell
    }
    return (cell.substring(0, 29)+"...")
}