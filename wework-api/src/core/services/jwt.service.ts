import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { getRepository } from 'typeorm';
import { User } from '../../database/entities/user';
import { RefreshToken } from '../../database/entities/refresh-token';
import config from '../helpers/jwt-secret';

export class JWTService {
    /**
     * Genera SOLO el token de acceso (Se usa en el Refresh)
     * Centralizamos aquí el tiempo de expiración corto (ej. 15m)
     */
    public generateToken(user: User): string {
        return jwt.sign({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
        },
            config.jwtSecret,
            { expiresIn: '15m' }); // Cambia a '1m' solo para pruebas rápidas
    }

    /**
     * Genera ambos tokens y guarda el Refresh en la DB (Se usa en el Login)
     */
    public async generateTokens(user: User) {
        // 1. Usamos el método de arriba para no repetir código
        const accessToken = this.generateToken(user);

        // 2. Generamos el Refresh Token aleatorio
        const refreshTokenStr = crypto.randomBytes(64).toString('hex');
        
        // 3. Guardamos en la base de datos
        const refreshTokenRepo = getRepository(RefreshToken);
        const rt = new RefreshToken();
        rt.user = user;
        rt.token = refreshTokenStr;
        // 7 días de standby
        rt.expiresAt = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); 
        
        await refreshTokenRepo.save(rt);

        return {
            accessToken,
            refreshToken: refreshTokenStr
        };
    }

    public decodeToken(token: string): any {
        try {
            return jwt.verify(token, config.jwtSecret);
        } catch (error) {
            return null;
        }
    }
}
