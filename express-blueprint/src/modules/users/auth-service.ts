import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
    ACCESS_TOKEN_EXPIRE,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRE,
    REFRESH_TOKEN_SECRET,
} from '../../config/app-config';

export class AuthService {
    private static readonly SALT_ROUNDS = 12;

    public static generateAccessToken({ userId }: { userId: string }) {
        return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRE,
        });
    }

    public static generateRefreshToken({ userId }: { userId: string }) {
        return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRE,
        });
    }

    public static hashPassword({ password }: { password: string }) {
        const salt = bcrypt.genSaltSync(this.SALT_ROUNDS);
        const hashed = bcrypt.hashSync(password, salt);
        return hashed;
    }

    public static checkPassword({ password, hashed }: { password: string; hashed: string }) {
        return bcrypt.compareSync(password, hashed);
    }
}
