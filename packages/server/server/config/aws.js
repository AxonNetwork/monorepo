
import AWS from 'aws-sdk'
import Elasticsearch from 'elasticsearch'
import Promise from 'bluebird'

Promise.config({
    longStackTraces: true,
})

AWS.config.update({
    region:          process.env.DYNAMODB_REGION,
    accessKeyId:     process.env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
})

let dynamo = new AWS.DynamoDB.DocumentClient()
dynamo = Promise.promisifyAll(dynamo, { suffix: 'Async' })

// const dynamo = { ...dynamoClient }
// const wrapFns = ['getAsync', 'putAsync', 'updateAsync', 'deleteAsync', 'batchGetAsync', 'batchWriteAsync', 'queryAsync']
// wrapFns.forEach(fn => {
//     dynamo[fn] = function () {
//         const err = new Error()
//         const outerStack = err.stack
//         const outerArgs = arguments

//         return dynamoClient[fn](...arguments).catch(err => {
//             let outerStackLines = outerStack.split('\n')
//             let caller = outerStackLines[2].trim()
//             outerStackLines = outerStackLines
//                 .filter(line => line.indexOf('aws-sdk') === -1 && line.indexOf('regenerator-runtime') === -1)
//                 .join('\n')

//             // console.log('the stack ~>', stack.join('\n'), '\n\n')
//             // console.log('the arguments ~>', outerArgs)
//             if (err.code) {
//                 throw new Error(`${caller}: AWS: ${err.code}: ${err.message}`)
//             } else {
//                 throw err
//             }
//         })
//     }
// })

const elasticsearch = new Elasticsearch.Client({
    host:            process.env.ELASTICSEARCH_HOST,
    log:             'error',
    connectionClass: require('http-aws-es'),
    awsConfig:       new AWS.Config({
        region:          process.env.ELASTICSEARCH_REGION,
        accessKeyId:     process.env.ELASTICSEARCH_ACCESS_KEY,
        secretAccessKey: process.env.ELASTICSEARCH_SECRET_KEY,
    }),
})

export {
    dynamo,
    elasticsearch,
    AWS,
}

