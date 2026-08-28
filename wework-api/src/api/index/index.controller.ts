import { Request, Response } from 'express';
import messages from './../../core/helpers/messages';
import { HttpResponseService } from './../../core/services/http-response.service';

export class IndexController {
  /**
   * Mensaje inicial
   * @param req Solicitud
   * @param res Respuesta
   */
  public async welcome(req: Request, res: Response) {
    HttpResponseService.response(res, 200, null, messages.general.welcome);
  }
}
