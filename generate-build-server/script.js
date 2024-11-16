const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')
const {Kafka} = require('kafkajs')
const PROJECT_ID = process.env.PROJECT_ID
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID
const KAFKA_BROKER_URL = process.env.KAFKA_BROKER_URL
const KAFKA_HOST_URL = process.env.KAFKA_HOST_URL
const KAFKA_USERNAME = process.env.KAFKA_USERNAME
const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD
const AWS_S_THREE_ACCESSKEYID = process.env.AWS_S_THREE_ACCESSKEYID
const AWS_S_THREE_SECRETACCESSKEY = process.env.AWS_S_THREE_SECRETACCESSKEY
const kafka = new Kafka({
    clientId: `docker-build-server-${DEPLOYMENT_ID}`,
    brokers:[KAFKA_BROKER_URL],
    ssl:{
        host:KAFKA_HOST_URL
    },
    sasl:{
        username:KAFKA_USERNAME,
        password:KAFKA_PASSWORD,
        mechanism:'plain'
    }
})
const producer = kafka.producer()
const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: AWS_S_THREE_ACCESSKEYID,
        secretAccessKey: AWS_S_THREE_SECRETACCESSKEY
    }
})



async function publishLog(log) {
    await producer.send({topic:'container-logs',messages:[{key:'log',value:JSON.stringify({PROJECT_ID,DEPLOYMENT_ID,log})}]})
}


async function init() {
    await producer.connect()
    console.log('Executing script.js')
    await publishLog('Build Started...')
    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)
    
    p.stdout.on('data', async function (data) {
        console.log(data.toString())
        await publishLog(data.toString())
    })

    p.stdout.on('error', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function () {
        console.log('Build Complete')
        await publishLog(`Build Complete`)
        const distFolderPath = path.join(__dirname, 'output', 'dist')
        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        await publishLog(`Starting to upload`)
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            await publishLog(`uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: 'deployease-builder',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            await publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }
        await publishLog(`Done`)
        console.log('Done...')
        process.exit(0)
    })
}

init()