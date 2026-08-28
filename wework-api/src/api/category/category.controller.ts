import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { CategoryService } from '../../core/services/category.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { Category } from './../../database/entities/category';

export class CategoryController {
  /**
   * Carga todas las categorías de la base de datos
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlList(req: Request, res: Response): Promise<void> {
    try {
      const categoryService = new CategoryService();
      const categories: Category[] = await categoryService.list();
      console.log('LAs categorias', categories)
      HttpResponseService.response(res, 200, categories, '');
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Carga las categorías por NEM
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlGetOneByNemWithSubcategories(req: Request, res: Response): Promise<void> {
    try {
      const categoryService = new CategoryService();
      const category: Category = await categoryService.getOneByNemWithSubcategories(req.params.nem);
      if (category) {
        HttpResponseService.response(res, 200, category, '');
      } else {
        HttpResponseService.response(res, 400, null, messages.category.invalidNem);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }
}
