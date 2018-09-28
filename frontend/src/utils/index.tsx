export const isProduction = process.env.NODE_ENV === 'production'

const exec = require('child_process').exec

export async function execCmd(cmd: string, cwd: string) {
    return new Promise((resolve, reject) => {
        exec(cmd, { encoding: 'utf8', cwd }, (error: Error|null, stdout: string, stderr: string) => {
            if (error) {
                reject(error)
            } else {
                resolve({ stdout, stderr })
            }
        })
    })
}
