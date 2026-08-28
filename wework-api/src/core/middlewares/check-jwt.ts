import { NextFunction, Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { UserService } from '../../core/services/user.service';
import { JWTService } from '../services/jwt.service';
import { HttpResponseService } from './../../core/services/http-response.service';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtService = new JWTService();
        const userService = new UserService();
        const ref = req.get('Referer');
        const referer = (ref) ? ref.split('/')[3] : ref;

        if (referer === 'online') {
            next();
        } else {
            // 1. Obtener el header
            const authHeader = req.headers.authorization;
            console.log('Aqui el authHeader....................', authHeader);

            if (!authHeader) return HttpResponseService.response(res, 401, null, messages.jwt.tokenInvalid);

            // 2. Extraer el token (Si viene 'Bearer eyJ...', tomamos solo 'eyJ...')
            const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

            let payload: any;
            // 3. Decodificar el token LIMPIO
            payload = jwtService.decodeToken(token);

            if (payload) {
                // 4. Buscar usuario con el token LIMPIO (Importante para que coincida en DB)
                const currentUser = await userService.searchUserByIdAndToken(payload.id, token);

                if (currentUser) {
                    req.user = currentUser;
                    next();
                } else {
                    HttpResponseService.response(res, 401, null, messages.jwt.userInvalid);
                }
            } else {
                HttpResponseService.response(res, 401, null, messages.jwt.tokenInvalid);
            }
        }
    } catch (error) {
        HttpResponseService.response(res, 401, error, messages.jwt.tokenExpired);
    }
};
