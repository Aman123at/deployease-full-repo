import { Server } from "socket.io";

export default class SocketService{
    getIo(httpServer){
        return new Server(httpServer, {
            pingTimeout: 60000,
            cors: {
              origin: process.env.CORS_ORIGIN,
              credentials: true,
            },
          });
    }
}