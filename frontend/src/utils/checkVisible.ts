
export default function checkVisible(elm: any, threshold?: number, mode?: 'visible' | 'above' | 'below') {
    threshold = threshold || 0
    mode = mode || 'visible'

    const rect = elm.getBoundingClientRect()
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
    const above = rect.bottom - threshold < 0

    const below = rect.top - viewHeight + threshold >= 0
    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below)
}