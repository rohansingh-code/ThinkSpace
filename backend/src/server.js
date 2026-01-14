import express from "express";
import notesRoutes from "./routes/notesRoutes.js"
import { connectDb } from "./config/db.js"
import dotenv from 'dotenv';
import rateLimiter from "./Middleware/rateLimiter.js";
import cors from 'cors';

dotenv.config();
const app = express();
const PORT  = process.env.PORT || 5001;



//middleware
app.use(cors(
    {
        origin: "http://localhost:5173",
    }
));
app.use(rateLimiter);
app.use(express.json());//allows us to parse JSON bodies,basically provides access to req.body

app.use((req,res,next)=>{
    console.log("we got a new req");
    next();
});//custom middleware


//routes
app.use("/api/notes",notesRoutes);


connectDb().then(() =>{
    app.listen(PORT,()=>{
    console.log("server started on port 5001");
    });
});//server should start after connecting database


// sL3HrEnerqGQWBny
// mongodb+srv://rohansingh23931_db_user:sL3HrEnerqGQWBny@cluster0.t4xwpeb.mongodb.net/?appName=Cluster0