import Redis from 'ioredis'
export default class RedisService{
    constructor(){
        this.subscriber = new Redis(process.env.REDIS_ACCESS_URL)
    }
    initRedisSubscribe(io){
        console.log('Subscribed to logs....')
        this.subscriber.psubscribe('logs:*')
        this.subscriber.on('pmessage', (pattern, channel, message) => {
            io.to(channel).emit('message', message)
        })
    }
}