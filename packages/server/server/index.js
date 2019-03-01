import 'dotenv/config'
import app from './app'
import watchNode from './watcher'
import setupRepoCache from './watcher/setupRepoCache'

app.listen(process.env.PORT, () => {
    console.log(`ITS ALIVE ON PORT ${process.env.PORT}`)
})

setupRepoCache()
watchNode()

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
