import "dotenv/config";
import jwt from "jsonwebtoken";

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not set in .env");
    }
    return secret;
}

const JWT_SECRET = getSecret();

export type TokenPayload = {userId : number};

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {expiresIn: "7d"});
}

export function verifyToken(token:string): TokenPayload {
    const decoded = jwt.verify(token,JWT_SECRET);
    if (typeof decoded ==="string" || typeof decoded.userId !=="number"){
        throw new Error("Invalid token payload")
    }
    return {userId: decoded.userId};

}