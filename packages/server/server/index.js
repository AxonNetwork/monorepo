import 'dotenv/config'
import app from './app'
import * as noderpc from './noderpc'

app.listen(process.env.PORT, () => {
    console.log(`ITS ALIVE ON PORT ${process.env.PORT}`)
})

process.on('SIGINT', () => { console.log('Bye bye!'); process.exit() })
