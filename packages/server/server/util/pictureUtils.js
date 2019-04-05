import stream from 'stream'
import Busboy from 'busboy'
import { AWS } from '../config/aws'
import path from 'path'
import sharp from 'sharp'

// opts: {
// 	imageSizes: boolean
// }
export async function getUploadedImage(req, opts = {}) {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({
            headers: req.headers,
            limits:  {
                files:    1,
                fileSize: process.env.MAX_UPLOAD_SIZE || 10 * 1024 * 1024, // default to 10mb max upload size
            },
        })

        const response = { otherFields: {} }
        const imageSizes = opts.imageSizes || [ [ 1024 ] ]
        busboy.on('file', async (fieldname, file, origFilename, encoding, mimetype) => {
            response.filestreams = imageSizes.map(size => ({
                filename: origFilename,
                size:     size.join('x'),
                stream:   file.pipe(sharp().resize(...size)),
            }))
        })
        busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) => {
            response.otherFields[fieldname] = val
        })
        busboy.on('finish', () => {
            resolve(response)
        })
        req.pipe(busboy)
    })
}

export async function pipeImageToS3(filestream, filename, bucket) {
    return new Promise((resolve, reject) => {
	    try {
	        const s3 = new AWS.S3({
	            params: {
	                Bucket: bucket,
	                Key:    filename,
	                Body:   filestream,
	                ACL:    'public-read',
	            },
	            options: { partSize: 5 * 1024 * 1024, queueSize: 10 }, // 5 MB
	        })

	        s3.upload().on('httpUploadProgress', (evt) => {
	           // console.log(evt)
	        }).send((err, data) => {
	            if (err) {
	                return reject(err)
	            }
	            resolve(data)
	        })
	    } catch (err) {
	        console.log('ERROR ~>', err)
	        reject(err)
        }
    })
}

export async function listS3Objects(bucket, prefix) {
    return new Promise((resolve, reject) => {
        try {
            const s3 = new AWS.S3()
            const params = {
                Bucket: bucket,
                Prefix: prefix,
            }
            s3.listObjects(params, (err, data) => {
                if (err) {
                    return reject(err)
                }
                console.log('list objects ~>', data)
                resolve(data.Contents.map(x => x.Key))
            })
        } catch (err) {
            console.log('ERROR ~>', err)
            reject(err)
        }
    })
}

export async function deleteImageFromS3(filename, bucket) {
    return new Promise((resolve, reject) => {
        try {
            const s3 = new AWS.S3()
            const params = {
                Bucket: bucket,
                Key:    filename,
            }
            s3.deleteObject(params, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            })
        } catch (err) {
	        console.log('ERROR ~>', err)
	        reject(err)
        }
    })
}
