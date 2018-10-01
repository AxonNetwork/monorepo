import { memoize } from 'lodash'

export const isProduction = process.env.NODE_ENV === 'production'

export function nullish<T>(x: T|null|undefined): x is undefined {
    return x === null || x === undefined
}

export const removeEmail = memoize(function(gitUsername: string) {
    return gitUsername.replace(/<.*>/, '').trim()
})

export const getUserInitials = memoize(function(name: string) {
    const allInitials = name.split(' ').map(x => x.substring(0, 1)).map(x => x.trim()).filter(x => x.length > 0)
    if (allInitials.length === 0) {
        return ''
    } else if (allInitials.length === 1) {
        return allInitials[0].toUpperCase()
    } else {
        return [ allInitials[0], allInitials[allInitials.length - 1] ].join('').toUpperCase()
    }
})

export const strToColor = memoize(function(str: string) {
    return colors[getHashCode(str) % colors.length]
})

var colors = [
    '#FF8A80',
    '#FF5252',
    '#FF1744',
    '#D50000',
    // '#FF80AB',
    '#FF4081',
    '#F50057',
    '#C51162',
    // '#EA80FC',
    '#E040FB',
    // '#AA00FF',
    '#B388FF',
    '#7C4DFF',
    '#651FFF',
    '#6200EA',
    '#8C9EFF',
    '#536DFE',
    '#3D5AFE',
    '#304FFE',
    '#82B1FF',
    '#448AFF',
    '#2979FF',
    '#2962FF',
    '#80D8FF',
    '#40C4FF',
    '#00B0FF',
    '#0091EA',
    '#26C6DA',
    '#00BCD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064',
    '#4DB6AC',
    '#26A69A',
    '#009688',
    '#00897B',
    '#00796B',
    '#00695C',
    '#004D40',
    '#66BB6A',
    '#4CAF50',
    '#43A047',
    '#388E3C',
    '#2E7D32',
    // '#1B5E20',
    '#FDD835',
    // '#FBC02D',
    '#F9A825',
    '#F57F17',
    '#FB8C00',
    '#F57C00',
    '#EF6C00',
    '#E65100',
    '#E64A19',
    '#D84315',
    '#BF360C',
    '#607D8B',
    // '#546E7A',
    '#455A64',
]

function getHashCode(str: string) {
    var hash = 0
    if (str.length === 0) return hash
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
        hash = hash & hash // Convert to 32bit integer
    }
    if (hash < 0) {
        hash *= -1
    }
    return hash
}

// function intToHSL(n: number) {
//     let shortened = n % 360
//     // Remove range similar to LOR Pink
//     // if (shortened > 295 && shortened < 230) {
//     //     shortened = shortened - 40
//     // }
//     return 'hsl(' + shortened + ',77%,60%)'
// }

