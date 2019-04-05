import 'dotenv/config'
import app from './app'
import watchNode from './watcher'
import setupRepoCache from './watcher/setupRepoCache'
import resetRepoCache from './watcher/resetRepoCache'

app.listen(process.env.PORT, () => {
    console.log(`ITS ALIVE ON PORT ${process.env.PORT}`)
})

// resetRepoCache()
setupRepoCache()
watchNode()

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
