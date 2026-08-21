import { NextFunction, Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { UserService } from '../../core/services/user.service';
import { User } from '../../database/entities/user';
import { JWTService } from '../services/jwt.service';
import { HttpResponseService } from './../../core/services/http-response.service';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const jwtService = new JWTService();
		const userService = new UserService();
		const ref = req.get('Referer');
		const referer = (ref) ? ref.split('/')[3] : ref;

		// Verify referer to online
		if (referer === 'online') {
			// Call the next middleware or controller
			next();
		} else {
			// Get the jwt token from the head
			const token = req.headers.authorization;
			let payload: any;
			let currentUser = new User();

			// Decode JWT
			payload = jwtService.decodeToken(token);

			// If token is not valid, respond with 401 (unauthorized)
			if (payload) {
				// Seach user in the database
				currentUser = await userService.searchUserByIdAndToken(payload.id, token);

				// Valid user exist
				if (currentUser) {
					// Call the next middleware or controller
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
