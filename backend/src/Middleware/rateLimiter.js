import ratelimit from "../config/upstash.js";


//after authentication replace my-limit-key with userid,making rate limit per user
const rateLimiter = async (req,res,next) =>{
    try {
        const {success} = await ratelimit.limit("my-limit-key");
        if(!success){
            return res.status(429).json({
                message:"Too many requests,Please try again later",
            });
        }
        next();
        
    } catch (error) {
        console.log("Ratelimit error",error);
        next();
        
    }
};
export default rateLimiter;