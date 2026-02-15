import express from "express";
import cors from "cors";
import DBinit from "./config/DBinit.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import cookieParser from "cookie-parser";
import uploadRoutes from "./routes/upload.route.js";
import chatRoutes from "./routes/chat.routes.js";
import dotenv from "dotenv";
dotenv.config();
const app=express();
app.use(cors({ origin: ["http://localhost:3001", "http://127.0.0.1:3001"], credentials: true }));
app.use(cookieParser());
//initalize database
DBinit();
//use routes
app.use("/api/auth",express.json(),authRoutes);
app.use("/api/admin",express.json(),adminRoutes);
app.use("/api",express.json(),chatRoutes);
app.use("/api/file",uploadRoutes);
//for testing chunk only
// app.use("/api/chunk",chunkRoutes);

//start server
const port=3000;
app.listen(port||3000,()=>{
try{
       console.log(`server is running on port ${port}. website: http://localhost:${port}`);
}catch(er){
    console.log("error occured while creating server: ",er)
} 
});