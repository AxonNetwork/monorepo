// const PROTO_PATH = __dirname + '/noderpc.proto'

// const protoLoader = window.require('@grpc/proto-loader')
// const grpcLibrary = window.require('grpc')

// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {})
// const packageObject = grpcLibrary.loadPackageDefinition(packageDefinition)

// const noderpc = packageObject.noderpc
// const client = new noderpc.NodeRPC('localhost:1338', grpcLibrary.credentials.createInsecure())

// client.getRefs({ repoID: 'protocol', pageSize: 10, page: 0 }, (err, resp) => {
//     console.log('err', err)
//     console.log('resp', resp)
// })

// const asdf = client.helloStream({ name: 'brynskies' })

// asdf.on('data', (resp) => {
//     console.log('data ~>', resp)
// })
