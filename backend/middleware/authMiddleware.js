import { verifyToken } from "../utils/helper";

export function authenticate(req,res,next){
    const header = req.headers.authorization;

    if(!header || !header.startsWith("Bearer ")){
        return res.status(401).json({message: "Authorization header missing"})
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyToken(token);
        req.user = payload;
        return next();
    } catch (error) {
        return res.status(401).json({message:"Invalid or expired token"})
    }
}