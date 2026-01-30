import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async(req,res,next) =>{
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password"); 
        
        next(); 

    } catch (error) {
        return res.status(401).json({ message: "Not authorized",error });

    }
};

export default protect;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTdjM2FhZDhmOTkxOGU5MGU4NzU4MTYiLCJpYXQiOjE3Njk3NDkxNjUsImV4cCI6MTc3MDM1Mzk2NX0.2_eODiGvtQcfoYnlv4lwhMQCxOnp3Au4Xc6DFY719BM