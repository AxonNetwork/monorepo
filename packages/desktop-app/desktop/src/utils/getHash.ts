import crypto from 'crypto'

export default function getHash(input: string) {
    return crypto.createHash('sha1').update(JSON.stringify(input)).digest('hex')
}
