import { createClient } from 'redis';
import { envVar } from './env';

export const redisClient = createClient({
    username: envVar.REDIS_USERNAME,
    password: envVar.REDIS_PASSWORD,
    socket: {
        host: envVar.REDIS_HOST,
        port: Number(envVar.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));



// await redisClient.set('foo', 'bar');
// const result = await redisClient.get('foo');
// console.log(result)  // >>> bar

export const connectRedis = async() => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log("Redis connected")
    }
}