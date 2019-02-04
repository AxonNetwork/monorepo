
const AWS = require('aws-sdk')
const Elasticsearch = require('elasticsearch')

const elasticsearch = new Elasticsearch.Client({
    host:            process.env.ELASTICSEARCH_HOST,
    log:             'error',
    connectionClass: require('http-aws-es'),
    awsConfig:       new AWS.Config({
        region:          process.env.ES_REGION,
        accessKeyId:     process.env.ES_ACCESS_KEY,
        secretAccessKey: process.env.ES_SECRET_KEY,
    }),
})

exports.handler = async (event, context) => {
    const updates = event.Records.map((record) => {
        return elasticsearch.index({
            index: 'comments',
            type:  'comment',
            id:    record.dynamodb.NewImage.commentID.S,
            body:  {
                text:         record.dynamodb.NewImage.text.S,
                repoID:       record.dynamodb.NewImage.repoID.S,
                discussionID: record.dynamodb.NewImage.discussionID.S,
            },
        })
    })

    await Promise.all(updates)

    console.log(`Successfully processed ${event.Records.length} records.`)
}
