import { spawn } from 'child_process'

export default function spawnCmd(cmd, args, cwd) {
    return new Promise((resolve, reject) => {
        let stdout = '',
            stderr = ''
        const proc = spawn(cmd, args, { cwd })
        proc.stdout.on('data', (data) => { stdout += data })
        proc.stderr.on('data', (data) => { stderr += data })
        proc.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(stderr))
            }
            return resolve(stdout)
        })
    })
}
