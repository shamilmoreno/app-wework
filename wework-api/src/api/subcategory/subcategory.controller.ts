import { sanitize } from 'class-sanitizer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { getCleanedString } from '../../core/helpers/str-utils';
import { CategoryService } from '../../core/services/category.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { SubcategoryService } from '../../core/services/subcategory.service';
import { Subcategory } from '../../database/entities/subcategory';
import { NotificationMiddleware } from './../../core/middlewares/notification.middleware';
import { Category } from './../../database/entities/category';

export class SubcategoryController {
    /**
     * Crea una subcategoria
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlCreate(req: Request, res: Response): Promise<void> {
        try {
            const subcategoryService = new SubcategoryService();
            const categoryService = new CategoryService();
            const subcategory = new Subcategory();
            const notificationMiddleware = new NotificationMiddleware();

            // Search category
            const category: Category = await categoryService.getOne(req.body.catId);
            console.log('Este es el id de la categoria de guardado', req.body.catId);

            if (category) {
                // Validate editable field
                if (category.editable) {
                    // Set object
                    let exists = false;
                    const subcatName = getCleanedString(req.body.name);
                    const subcat = await categoryService.getOneWithSubcategories(category.id);

                    // Verify if exists this subcategory on category
                    subcat.subcategories.forEach((element: any) => {
                        exists = (getCleanedString(element.name) === subcatName);
                    });

                    if (!exists) {
                        subcategory.name = req.body.name;
                        subcategory.category = category;

                        // Validate object
                        const subcategoryErrors = await validate(subcategory);
                        if (subcategoryErrors.length > 0) {
                            HttpResponseService.response(res, 400, subcategoryErrors, messages.general.error);
                        }

                        // Sanitize data
                        sanitize(subcategory);

                        // Create notification
                        notificationMiddleware.createChangeSystemValues();

                        // Save
                        const data = await subcategoryService.saveChanges(subcategory);
                        HttpResponseService.response(res, 200, data, messages.subcategory.subcategoryCreated);
                    } else {
                        HttpResponseService.response(res, 400, null, messages.subcategory.subcategoryExists);
                    }
                } else {
                    HttpResponseService.response(res, 400, null, messages.subcategory.subcategoryNotEditable);
                }
            } else {
                HttpResponseService.response(res, 404, null, messages.category.categoryNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Actualiza una subcategoria
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlUpdate(req: Request, res: Response): Promise<void> {
        try {
            // Search subcategory
            const subcategoryService = new SubcategoryService();
            const categoryService = new CategoryService();
            const notificationMiddleware = new NotificationMiddleware();

            // Search category
            const category: Category = await categoryService.getOne(req.body.catId);

            if (category) {
                // Search Subcategory
                const subcategory: Subcategory = await subcategoryService.getOne(parseInt(req.body.id));

                if (subcategory) {
                    // Validate editable field
                    if (subcategory.category.editable) {
                        subcategory.name = req.body.name;

                        // Validate object
                        const errors = await validate(subcategory);
                        if (errors.length > 0) {
                            HttpResponseService.response(res, 400, errors, messages.general.error);
                        }

                        // Sanitize data
                        sanitize(subcategory);

                        // Create notification
                        notificationMiddleware.createChangeSystemValues();

                        // Save
                        const data = await subcategoryService.saveChanges(subcategory);
                        HttpResponseService.response(res, 200, data, messages.subcategory.subcategoryUpdated);
                    } else {
                        HttpResponseService.response(res, 400, null, messages.subcategory.subcategoryNotEditable);
                    }
                } else {
                    HttpResponseService.response(res, 404, null, messages.subcategory.subcategoryNotFound);
                }
            } else {
                HttpResponseService.response(res, 404, null, messages.category.categoryNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Elimina una subcategoria
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlRemove(req: Request, res: Response): Promise<void> {
        try {
            // Search subcategory
            const subcategoryService = new SubcategoryService();
            const notificationMiddleware = new NotificationMiddleware();
            const subcategory: Subcategory = await subcategoryService.getOne(parseInt(req.params.id));

            if (subcategory) {
                // Validate editable field
                if (subcategory.category.editable) {
                    const data = await subcategoryService.remove(parseInt(req.params.id));
                    if (data.affected > 0) {
                        // Create notification
                        notificationMiddleware.createChangeSystemValues();

                        // Response
                        HttpResponseService.response(res, 200, null, messages.subcategory.subcategoryDeleted);
                    } else {
                        HttpResponseService.response(res, 401, null, messages.general.error);
                    }
                } else {
                    HttpResponseService.response(res, 401, null, messages.subcategory.subcategoryNotEditable);
                }
            } else {
                HttpResponseService.response(res, 404, null, messages.subcategory.subcategoryNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }
}
