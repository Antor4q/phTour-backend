import {Server} from 'http';

import mongoose from 'mongoose';
import app from './app';
import { envVar } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
import { connectRedis } from './app/config/redis.config';

let server: Server;


const startServer = async() => {
    try {
        console.log(envVar.NODE_ENV)
        await mongoose.connect(envVar.DB_URL || '');
        
        console.log('Connected to MongoDB');
        server = app.listen(envVar.PORT, () => {
            console.log(`Server is running on port ${envVar.PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
}

(async()=>{
 await connectRedis()
 await   startServer();
 await seedSuperAdmin();
})()


// 25-10 sigterm rejection error
process.on('SIGTERM', () => {
    console.log("SIGTERM signal received. Server is shutting down...");
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})
// 25-10 sigterm signal apply
process.on('SIGINT', () => {
    console.log("SIGINT signal received. Server is shutting down...");
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})

// 25-10 unhandled rejection error
process.on('unhandledRejection', (err)=> {
    console.log("Unhandled Rejection detected. Server is shutting down...",err)
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})

// Promise.reject(new Error("This is an unhandled rejection error"));
// 25-10 uncaught rejection error
process.on('uncaughtException', (err)=> {
    console.log("Uncaught Exception detected. Server is shutting down...",err)
    if(server){
        server.close();
        process.exit(1);
    }
    process.exit(1);
})

// throw new Error("I forgot to handle this local error");

/**
 * unhandled rejection error
 * uncaught rejection error
 * signal termination sigterm
 * **/ 

