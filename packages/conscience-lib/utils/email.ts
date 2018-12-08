import { memoize } from 'lodash'

export const removeEmail = memoize(function(gitUsername: string) {
    return gitUsername.replace(/<.*>/, '').trim()
})

export const extractEmail = memoize(function(gitUsername: string) {
    const match = gitUsername.match(/<(.*)>/)
    if (!match) {
        return undefined
    }
    return match[1].trim()
})
