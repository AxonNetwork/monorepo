export default function nonCacheImg(src: string) {
    const rand = Math.floor(Math.random() * 6)
    return src + "?noncache=" + rand
}