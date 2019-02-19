import 'dotenv/config'
import app from './app'
import watchNode from './watcher'

app.listen(process.env.PORT, () => {
    console.log(`ITS ALIVE ON PORT ${process.env.PORT}`)
})

watchNode(process.env.SERVER_ID)

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
