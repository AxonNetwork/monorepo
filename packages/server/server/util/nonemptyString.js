
export default function nonemptyString(str) {
    return str !== undefined && str !== null && typeof str === 'string' && str.length > 0
}
