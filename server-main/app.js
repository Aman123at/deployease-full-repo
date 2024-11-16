import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import passport from 'passport';
import session from "express-session";
import {createServer} from 'http';
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
import SocketService from "./services/SocketIO.service.js";
// import RedisService from "./services/Redis.service.js";
import KafkaService from "./services/Kafka.service.js";

//server initializations
const app = express();
const httpServer = createServer(app);
const socketService = new SocketService()
// const redisService = new RedisService()
const kafkaService = new KafkaService()
const io = socketService.getIo(httpServer)

// connected to socket
io.on('connection', socket => {
    console.log('User connected to socket server')
    socket.on('subscribe', channel => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})

// Redis subscription initialized
// redisService.initRedisSubscribe(io)
kafkaService.initConsumer()

// cors middleware
app.use(
    cors({
      origin:
        process.env.CORS_ORIGIN === "*"
          ? "*" 
          : process.env.CORS_ORIGIN?.split(","), 
      credentials: true,
    })
  );

app.set("io", io); 

app.use(express.json());
app.use(cookieParser());

// express-session for persisted session
app.use(
    session({
      secret: process.env.EXPRESS_SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    })
  ); // session secret


// passport initialization for OAuth
app.use(passport.initialize());
app.use(passport.session()); 

// Registering API routes
app.use('/api/user',userRouter)
app.use('/api/project',projectRouter)

export { httpServer };