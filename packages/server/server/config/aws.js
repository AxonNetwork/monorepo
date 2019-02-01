
import AWS from 'aws-sdk'
import Promise from 'bluebird'

AWS.config.update({
    region: process.env.DYNAMODB_REGION,
    // endpoint: 'http://localhost:8000',
    accessKeyId: process.env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
})

let dynamo = new AWS.DynamoDB.DocumentClient()
dynamo = Promise.promisifyAll(dynamo, { suffix: 'Async' })

export {
    dynamo,
    AWS,
}

