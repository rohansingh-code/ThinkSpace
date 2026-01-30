import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import { connectDb } from "./config/db.js"
import dotenv from 'dotenv';
import rateLimiter from "./Middleware/rateLimiter.js";
import cors from 'cors';
import path from "path";

dotenv.config();
const app = express();
const PORT  = process.env.PORT || 5001;
const __dirname = path.resolve();



//middleware
if(process.env.NODE_ENV !== "production"){
     app.use(cors(
        {
            origin: "http://localhost:5173",
        }
    ));
}
app.use(rateLimiter);
app.use(express.json());//allows us to parse JSON bodies,basically provides access to req.body

app.use((req,res,next)=>{
    console.log("we got a new req");
    next();
});//custom middleware


//routes
app.use("/api/notes",notesRoutes);
app.use("/api/user",userRoutes);

if(process.env.NODE_ENV === "production" ){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}


connectDb().then(() =>{
    app.listen(PORT,()=>{
    console.log("server started on port 5001");
    });
});//server should start after connecting database

