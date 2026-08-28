import { Response } from 'express';

export class HttpResponseService {
	/**
	 * Formato de respuesta
	 * @param res Respuesta del usuario
	 * @param currentCode Código de respuesta
	 * @param currentData Objeto de respuesta
	 * @param currentMessage Mensaje a mostrar en el cliente
	 */
	public static response(res: Response, currentCode: number, currentData: any, currentMessage: string): void {
		console.log(currentData);
		res.status(currentCode).json({
			code: currentCode,
			response: currentData,
			message: currentMessage,
		});
		return;
	}
}
