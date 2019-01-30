
export default function retry<T>(opts: { timeout: number, retries: number }, operation: () => T) {
    return new Promise<T>((resolve, reject) => {
        let repeat = opts.retries
        const attempt = async function() {
            try {
                const result = await operation()
                resolve(result)
            } catch (err) {
                repeat -= 1
                if (repeat > 0) {
                    setTimeout(attempt, opts.timeout)
                } else {
                    reject(err)
                }
            }
        }
        attempt()
    })
}
