
import AWS from 'aws-sdk'
import Elasticsearch from 'elasticsearch'
import Promise from 'bluebird'

AWS.config.update({
    region:          process.env.DYNAMODB_REGION,
    accessKeyId:     process.env.DYNAMODB_ACCESS_KEY,
    secretAccessKey: process.env.DYNAMODB_SECRET_KEY,
})

let dynamo = new AWS.DynamoDB.DocumentClient()
dynamo = Promise.promisifyAll(dynamo, { suffix: 'Async' })

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

