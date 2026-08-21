import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { checkEnvironment } from '../../core/middlewares/check-environment';
import { HttpResponseService } from '../../core/services/http-response.service';
import { JWTService } from '../../core/services/jwt.service';
import { UserService } from '../../core/services/user.service';
import { IEnvironment } from '../../core/interfaces/ienvironment';
import { EmailMiddleware } from '../../core/middlewares/email.middleware';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { User } from '../../database/entities/user';

export class AuthController {
	/**
	 * Validar usuario y contraseña
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlLogin(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const jwtService = new JWTService();

			// Check if username and password are set
			if (!req.body.email.toLowerCase() || !req.body.password) {
				return HttpResponseService.response(res, 401, null, messages.auth.invalidData);
			}

			// Get user from database
			const user: User = await userService.verifyEmail(req.body.email.toLowerCase());

			if (!user) {
				return HttpResponseService.response(res, 401, null, messages.auth.invalidInfo);
			}

			// Check if encrypted password matches
			if (!user.checkIfUnencryptedPasswordIsValid(req.body.password)) {
				return HttpResponseService.response(res, 401, null, messages.auth.invalidInfo);
			}

			// Generate and save token in database
			user.token = jwtService.generateToken(user);
			const userWithToken = await userService.saveUser(user);

			// Send the JWT in the response
			if (userWithToken.token) {
				return HttpResponseService.response(res, 200, userWithToken, `Bienvenid@,\n${userWithToken.firstName} ${userWithToken.lastName}`);
			} else {
				return HttpResponseService.response(res, 400, null, messages.auth.failToCreateToken);
			}
		} catch (error) {
			return HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}


	/**
	 * Cerrar sesión del usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlLogout(req: Request, res: Response): Promise<void> {
		try {
			// Logout of user
			const userService = new UserService();
			const result = await userService.logout(req.headers.authorization);

			// Validate result
			if (result) {
				HttpResponseService.response(res, 200, null, messages.auth.logoutSuccess);
			} else {
				HttpResponseService.response(res, 400, null, messages.auth.logoutError);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Solicitud para el cambio de contraseña
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlRequestChangePassword(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const jwtService = new JWTService();
			const emailMiddleware = new EmailMiddleware();
			const notificationMiddleware = new NotificationMiddleware();

			// Check email are set
			if (!req.body.email) {
				HttpResponseService.response(res, 400, null, messages.auth.invalidEmail);
			}

			// Get user from database
			const user: User = await userService.verifyEmail(req.body.email);
			if (!user) {
				HttpResponseService.response(res, 200, null, messages.auth.infoToRequestChangePassword);
			}

			// Generate and save token on database
			user.token = jwtService.generateToken(user);
			const userWithToken = await userService.saveUser(user);

			// Loading vars
			const env: IEnvironment = checkEnvironment();

			// Send email to user
			emailMiddleware.sendRequestToChangePassword({
				to: userWithToken.email,
				data: {
					doctorName: userWithToken.firstName,
					token: userWithToken.token,
					route: env.CLIENT_SERVER,
				},
			});

			// Create notification
			notificationMiddleware.createRequestToChangePassword();

			// Send the jwt in the response
			if (userWithToken.token) {
				HttpResponseService.response(res, 200, null, messages.auth.infoToRequestChangePassword);
			} else {
				HttpResponseService.response(res, 400, null, messages.auth.verifyTokenError);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Validar token del usuario
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlValidateToken(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();

			// Check token are set
			if (!req.params.token) {
				HttpResponseService.response(res, 400, null, messages.auth.invalidToken);
			}

			// Validate token
			const result: User = await userService.validateToken(req.params.token);

			// Validate result
			if (result) {
				HttpResponseService.response(res, 200, null, messages.auth.validToken);
			} else {
				HttpResponseService.response(res, 400, null, messages.auth.invalidToken);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Change password user on the database
	 * @param req Request
	 * @param res Response
	 */
	public async ctrlChangePassword(req: Request, res: Response): Promise<void> {
		try {
			const userService = new UserService();
			const jwtService = new JWTService();
			const notificationMiddleware = new NotificationMiddleware();
			const emailMiddleware = new EmailMiddleware();

			// Check password are set
			if (!req.body.password) {
				HttpResponseService.response(res, 400, null, messages.auth.invalidPassword);
			}

			// Change password
			const result = await userService.changePassword(req.headers.authorization, req.body.password);

			// Validate result
			if (result) {
				// Create notification
				notificationMiddleware.createChangePassword();

				// Send email
				const data = jwtService.decodeToken(req.headers.authorization);
				emailMiddleware.sendChangePassword({
					to: data.email,
					data: { doctorName: data.firstName },
				});

				// Response
				HttpResponseService.response(res, 200, null, messages.auth.changePasswordSuccess);
			} else {
				HttpResponseService.response(res, 400, null, messages.auth.changePasswordError);
			}
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}
}
