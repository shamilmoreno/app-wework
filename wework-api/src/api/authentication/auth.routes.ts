import { Router } from 'express';
import { checkJwt } from '../../core/middlewares/check-jwt';
import { AuthController } from './auth.controller';

export class AuthRoutes {
	public router: Router = Router();
	private ac = new AuthController();

	constructor() {
		/* this.router.get('/validate/:token', this.ac.ctrlValidateToken);
		this.router.post('/login', this.ac.ctrlLogin);
		this.router.post('/request-change-password', this.ac.ctrlRequestChangePassword);
		this.router.patch('/change-password', checkJwt, this.ac.ctrlChangePassword);
		this.router.delete('/logout', checkJwt, this.ac.ctrlLogout);
	 */
		// Rutas públicas (No requieren token válido)
		this.router.get('/validate/:token', this.ac.ctrlValidateToken);
		this.router.post('/login', this.ac.ctrlLogin);
		this.router.post('/request-change-password', this.ac.ctrlRequestChangePassword);

		/** 
		 * NUEVA RUTA: Para renovar el Access Token
		 * Debe ser POST y SIN checkJwt 
		 */
		this.router.post('/refresh', (req, res) => this.ac.ctrlRefreshToken(req, res));

		// Rutas privadas (Requieren token válido)
		this.router.patch('/change-password', checkJwt, this.ac.ctrlChangePassword);
		this.router.delete('/logout', checkJwt, this.ac.ctrlLogout);
	}
}
