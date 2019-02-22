import 'dotenv/config'
import app from './app'
import watchNode from './watcher'
import { addRepoToCache } from './watcher/updateRepoCache'

app.listen(process.env.PORT, () => {
    console.log(`ITS ALIVE ON PORT ${process.env.PORT}`)
})

watchNode()

// addRepoToCache('datnewnew')

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
