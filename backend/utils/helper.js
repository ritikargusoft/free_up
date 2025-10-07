import jwt from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN

export function generateToken(payload){
    return jwt.sign(payload, JWT_SECRET,{
        expiresIn: JWT_EXPIRES_IN
    });
}

export function generateRefreshToken(payload){
    return jwt.sign(payload, JWT_REFRESH_SECRET,{
        expiresIn: JWT_REFRESH_EXPIRES_IN
    })
}

export function verifyToken(token){
    return jwt.verify(token, JWT_SECRET)
}


export function verifyRefreshToken(token){
    return jwt.verify(token, JWT_REFRESH_SECRET)
}