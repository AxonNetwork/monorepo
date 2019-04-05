
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

async function fetchExisting(userID) {
    try {
        const resp = await elasticsearch.get({ index: 'users', type: 'user', id: userID })
        const item = resp._source
        return item

    } catch (err) {
        if (err.status === 404) {
            return {}
        } else {
            console.error('Error fetching existing Elasticsearch record:', err)
            return null
        }
    }
}

exports.handler = async (event, context) => {
    const updates = event.Records.map(async (record) => {
        if (record.eventSourceARN.indexOf('table/ConscienceAPI_UserProfiles') > -1) {
            // Handle updates to the UserProfiles table

            let user = await fetchExisting(record.dynamodb.NewImage.userID.S)
            if (user === null) {
                return Promise.resolve()
            }

            user = {
                ...user,
                bio:         record.dynamodb.NewImage.bio.S,
                geolocation: record.dynamodb.NewImage.geolocation.S,
                orcid:       record.dynamodb.NewImage.orcid.S,
                university:  record.dynamodb.NewImage.university.S,
                interests:   record.dynamodb.NewImage.interests.L.map(x => x.S),
            }

            return elasticsearch.index({
                index: 'users',
                type:  'user',
                id:    record.dynamodb.NewImage.userID.S,
                body:  user,
            })

        } else if (record.eventSourceARN.indexOf('table/ConscienceAPI_Users') > -1) {
            // Handle updates to the Users table

            let user = await fetchExisting(record.dynamodb.NewImage.userID.S)
            if (user === null) {
                return Promise.resolve()
            }

            user = {
                ...user,
                username: record.dynamodb.NewImage.username.S,
                name:     record.dynamodb.NewImage.name.S,
            }

            return elasticsearch.index({
                index: 'users',
                type:  'user',
                id:    record.dynamodb.NewImage.userID.S,
                body:  user,
            })
        }
    })

    await Promise.all(updates)

    console.log(`Successfully processed ${event.Records.length} records.`)
}
