import crypto from 'crypto'
import memoize from 'lodash/memoize'

export default memoize(function getHash(input: string) {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
})
