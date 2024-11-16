import { httpServer } from "./app.js";
import connectDB from "./db/index.js";


const startServer = () => {
    httpServer.listen(process.env.PORT || 9000, () => {
      console.log("⚙️  Server is running on port: " + process.env.PORT);
    });
};


// Database connection and Server initialization
connectDB()
    .then(() => {
        startServer();
    })
    .catch((err) => {
        console.log("Mongo db connect error: ", err);
    });