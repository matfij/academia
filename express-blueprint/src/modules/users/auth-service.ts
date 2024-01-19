import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRE, ACCESS_SECRET } from '../../config/app-config';

export class AuthService {
    public static generateAccessToken({ userId }: { userId: string }) {
        return jwt.sign({ userId }, ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRE,
        });
    }

    public static generateRefreshToken({ userId }: { userId: string }) {
        return jwt.sign({ userId }, ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRE,
        });
    }

    public static hashPassword({password}: {password: string}) {
        // TODO - add hashing lib
        return password;
    }
    
    public static checkPassword({ password, hashed }: { password: string; hashed: string }) {
        // TODO - add hashing lib
        return password === hashed;
    }
}
