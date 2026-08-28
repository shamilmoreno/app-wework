import { sanitize } from "class-sanitizer";
import { Request, Response } from "express";
import messages from "../../core/helpers/messages";
import { BagRecipe } from "../../database/entities/bag-recipe";
import { BagRecipeService } from "../../core/services/bag-recipe.service";
import { NotificationMiddleware } from "../../core/middlewares/notification.middleware";
import { HttpResponseService } from "../../core/services/http-response.service";
import { getCurrentDate } from "../../core/helpers/str-utils";
import { BagRecipeModel } from "../../core/models/bag-recipe.model";
import { validate } from "class-validator";
import { parseNumberFromFormat } from '../../core/helpers/parseNumberFromFormat';
import moment from "moment";
import { InventoryStockService } from "../../core/services/inventory-stock.service";
import { InventoryMovement } from "../../database/entities/inventory-movement";
import { User } from "../../database/entities/user";
import { UserService } from "../../core/services/user.service";
import { JWTService } from "../../core/services/jwt.service";
import { InventoryStock } from "../../database/entities/inventory-stock ";
import { InventoryMovementService } from "../../core/services/inventory-movement.service";
import { BagRecipeDto } from "../../core/dto/bag-recipe.dto";
import { plainToInstance } from "class-transformer";
import { MovementType } from "../../core/enums/movement-type.enum";
import { toNumber } from "../../core/helpers/toNumber";

// INTERFACE
import { Totals } from "../../core/interfaces/totals";
import { TotalsAccumulator } from "../../core/interfaces/totalsAccumulator";

export class BagRecipeController {
    /**
     * Carga todos las recetas de la base de datos
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlList(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();
/*             const bagRecipes: BagRecipe[] = await bagRecipeService.list();
 */            const bagRecipes: BagRecipe[] = await bagRecipeService.listNew(req, res);

            HttpResponseService.response(res, 200, bagRecipes, "");
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Cargar Receta por Id
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlGetOne(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();
            const bagRecipeController = new BagRecipeController();

            // Find Bag Receta
            const bagRecipe: BagRecipe = await bagRecipeService.getOne(parseInt(req.params.id));

            // Standardization and organization of the recipe
            const bagRecipeResult = await bagRecipeController.getStructureBagRecipe(bagRecipe);

            // Valid the info
            if (bagRecipeResult) {
                HttpResponseService.response(res, 200, bagRecipeResult[0], "");
            } else {
                HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Cargar detalle de la Receta
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();
            const bagRecipeController = new BagRecipeController();

            // Find Bag Recipe
            const bagRecipe: BagRecipe = await bagRecipeService.getOneForDetail(parseInt(req.params.id));

            // Build the info
            const bagRecipeResult = await bagRecipeController.getStructureBagRecipe(bagRecipe);

            // Valid the info
            if (bagRecipeResult) {
                HttpResponseService.response(res, 200, bagRecipeResult[0], "");
            } else {
                HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Crea una nueva receta
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlCreate(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();

            // Creating a instance of Bag Recipe
            const bagRecipe = new BagRecipe();
            bagRecipe.monthRecipeBag = req.body.monthRecipeBag;
            //bagRecipe.numberBags = Number(/,/.test(req.body.numberBags) ? req.body.numberBags.replace(/,/g, "") : req.body.numberBags);
            bagRecipe.numberBags = parseNumberFromFormat(req.body.numBags);
            //bagRecipe.operatingExpense = Number(/,/.test(req.body.operatingExpense) ? req.body.operatingExpense.replace(/,/g, "") : req.body.operatingExpense);
            bagRecipe.operatingExpense = parseNumberFromFormat(req.body.numBags);;
            //bagRecipe.maquila = Number(/,/.test(req.body.maquila) ? req.body.maquila.replace(/,/g, "") : req.body.maquila);
            bagRecipe.maquila = parseNumberFromFormat(req.body.maquila);;
            //bagRecipe.tax = Number(/,/.test(req.body.tax) ? req.body.tax.replace(/,/g, "") : req.body.tax);
            bagRecipe.tax = parseNumberFromFormat(req.body.tax);;
            //bagRecipe.commission = Number(/,/.test(req.body.commission) ? req.body.commission.replace(/,/g, "") : req.body.commission);
            bagRecipe.commission = parseNumberFromFormat(req.body.commission);
           //bagRecipe.warehouse = 1;

            // Validar los datos entrantes con DTO
            const dto = plainToInstance(BagRecipeDto, bagRecipe);
            const bahRecipeErros = await validate(dto);

            if (bahRecipeErros.length > 0) {
                HttpResponseService.response(res, 400, bahRecipeErros, messages.general.error);
                return;
            }

            // Sanitize data
            sanitize(bagRecipe);

            // Save Changes
            const result = await bagRecipeService.saveChanges(bagRecipe);
            HttpResponseService.response(res, 200, result, messages.bagRecipe.bagRecipeCreated);
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Actualiza una Receta
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlUpdate(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();

            // Search procedure
            const bagRecipe: BagRecipe = await bagRecipeService.getOne(req.body.id);
            if (bagRecipe) {
                bagRecipe.monthRecipeBag = req.body.monthRecipeBag;
                bagRecipe.numberBags = Number(/,/.test(req.body.numberBags) ? req.body.numberBags.replace(/,/g, "") : req.body.numberBags);
                bagRecipe.operatingExpense = Number(/,/.test(req.body.operatingExpense) ? req.body.operatingExpense.replace(/,/g, "") : req.body.operatingExpense);
                bagRecipe.maquila = Number(/,/.test(req.body.maquila) ? req.body.maquila.replace(/,/g, "") : req.body.maquila);
                bagRecipe.tax = Number(/,/.test(req.body.tax) ? req.body.tax.replace(/,/g, "") : req.body.tax);
                bagRecipe.commission = Number(/,/.test(req.body.commission) ? req.body.commission.replace(/,/g, "") : req.body.commission);

                // Validar los datos entrantes con DTO
                const dto = plainToInstance(BagRecipeDto, bagRecipe);
                const bahRecipeErros = await validate(dto);

                if (bahRecipeErros.length > 0) {
                    HttpResponseService.response(res, 400, bahRecipeErros, messages.general.error);
                    return;
                }

                // Sanitize data
                sanitize(bagRecipe);

                // Save Changes
                const result = await bagRecipeService.saveChanges(bagRecipe);
                HttpResponseService.response(res, 200, result, messages.bagRecipe.bagRecipeUpdated
                );
            } else {
                HttpResponseService.response(res, 404, "", messages.bagRecipe.bagRecipeNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Elimina una Reseta
     * @param req Solicitud
     * @param res Respuesta
     */
    public async ctrlRemove(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();
            const notificationMiddleware = new NotificationMiddleware();
            const bagRecipe: BagRecipe = await bagRecipeService.getOne(parseInt(req.params.id));

            if (bagRecipe) {
                const data = await bagRecipeService.remove(parseInt(req.params.id));
                if (data.affected > 0) {
                    HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDeleted);
                } else {
                    HttpResponseService.response(res, 401, null, messages.general.error);
                }
            } else {
                HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    /**
     * Inactuvar una Receta
     * @param req
     * @param res
     */
    public async ctrlSetInactive(req: Request, res: Response): Promise<void> {
        try {
            const bagRecipeService = new BagRecipeService();
            const inventoryStockService = new InventoryStockService();
            const inventoryMovementService = new InventoryMovementService();
            const notificationMiddleware = new NotificationMiddleware();
            const userService = new UserService();
            const jwtService = new JWTService();

            // Get the jwt token from the head
            const token = req.headers.authorization;
            let payload: any;
            let currentUser = new User();
            // Decode JWT
            payload = jwtService.decodeToken(token);
            // Seach user in the database
            currentUser = await userService.searchUserByIdAndToken(payload.id, token);
            const bagRecipe: BagRecipe = await bagRecipeService.getOne(
                parseInt(req.body.id)
            );

            if (bagRecipe) {
                bagRecipe.isActive = false;
                const data = await bagRecipeService.update(bagRecipe);
                if (data) {
                    if (bagRecipe.items) {
                        bagRecipe.items.forEach(async (currentItem) => {
                            const itemName = currentItem.product.name;
                            const inventoryMovement = new InventoryMovement();
                            if (itemName != "Bolsa") {
                                const inventoryStock: InventoryStock = await inventoryStockService.getOneByProductId(currentItem.product.id);

                                inventoryStock.quantity += currentItem.totalQuantityRequired;
                                inventoryMovement.description = "Devolución de stock al inventario: proceso de restituir productos que han sido retornados por eliminación de Receta, ajustando y aumentando la cantidad disponible en el inventario.";
                                inventoryMovement.destination = "Receta";
                                inventoryMovement.guideNumber = bagRecipe.serialCode;
                                inventoryMovement.quantity = currentItem.totalQuantityRequired;
                                inventoryMovement.movementType = MovementType.RETURN;
                                inventoryMovement.responsibleUser = currentUser.firstName + " " + currentUser.lastName;
                                inventoryMovement.stockAfterMovement = currentItem.totalQuantityRequired;
                                inventoryMovement.referenceType = "BagRecipe";
                                inventoryMovement.referenceId = bagRecipe.serialCode;
                                //inventoryMovement.inventoryStock = inventoryStock;
                                inventoryMovement.date = getCurrentDate();

                                // Se guarda la devolucion en Stock
                                await inventoryStockService.saveChanges(inventoryStock);
                                // Se guarda el movimineto en Stock Movimiento
                                if (inventoryMovement.quantity > 0) {
                                    await inventoryMovementService.saveChanges(inventoryMovement);
                                }
                            }
                        });
                    }
                    HttpResponseService.response(res, 200, null, messages.bagRecipe.bagRecipeDeleted);
                } else {
                    HttpResponseService.response(res, 401, null, messages.general.error);
                }
            } else {
                HttpResponseService.response(res, 404, null, messages.bagRecipe.bagRecipeNotFound);
            }
        } catch (error) {
            HttpResponseService.response(res, 500, error, messages.general.error);
        }
    }

    public async getStructureBagRecipe(bagRecipes: BagRecipe[] | BagRecipe | undefined): Promise<BagRecipeModel[]> {
        try {
            if (!bagRecipes) {
                console.warn("⚠️ No se recibió ninguna receta.");
                return [];
            }

            // 🔧 Normalizar: convertir a array siempre
            const recipesArray = Array.isArray(bagRecipes) ? bagRecipes : [bagRecipes];
            //console.log('Presentación del arreglo de Recetas a trabajar en: getStructureBagRecipe', recipesArray);

            if (recipesArray.length === 0) {
                console.warn("⚠️ No se recibieron recetas para procesar.");
                return [];
            }

            const bagRecipesDetail = recipesArray.map((recipe) => {
                const {
                    id,
                    serialCode,
                    monthRecipeBag,
                    numberBags = 0,
                    operatingExpense,
                    maquila,
                    tax,
                    commission,
                    maquiladors = [],
                    items = [],
                    payments = [],
                    warehouse
                } = recipe;

                if (!items.length) {
                    console.warn(`⚠️ La receta ${serialCode} no tiene items asociados.`);
                }

                // 🔹 Estructurar items individuales
                const itemList = items.map((i: any) => ({
                    id: i.id,
                    bagRecipeId: i.bagRecipe.id,
                    quantity: i.quantity ?? 0,
                    totalQuantityRequired: i.totalQuantityRequired ?? 0,
                    costPrice: toNumber(i.costPrice),
                    costPriceBs: toNumber(i.costPriceBs),
                    salePrice: toNumber(i.salePrice),
                    salePriceBs: toNumber(i.salePriceBs),
                    totalCostPrice: toNumber(i.totalCostPrice) || toNumber(i.costPrice) * toNumber(i.quantity),
                    totalCostPriceBs: toNumber(i.totalCostPriceBs) || toNumber(i.costPriceBs) * toNumber(i.quantity),
                    totalSalePrice: toNumber(i.totalSalePrice) || toNumber(i.salePrice) * toNumber(i.quantity),
                    totalSalePriceBs: toNumber(i.totalSalePriceBs) || toNumber(i.salePriceBs) * toNumber(i.quantity),
                    freightAmount: toNumber(i.freightAmount),
                    freightAmountBs: toNumber(i.freightAmountBs),
                    totalFreightAmount: toNumber(i.totalFreightAmount),
                    totalFreightAmountBs: toNumber(i.totalFreightAmountBs),
                    product: i.product
                        ? {
                            ...i.product,
                            stock: i.product.stock?.[0] ?? null
                        }
                        : null,
                    selected: true // ✅ todos los items que vienen de la receta están seleccionados

                }));

                // Acumuladores tipados
                const totals = items.reduce<TotalsAccumulator>(
                    (acc, i) => {
                        const quantity = toNumber(i.quantity)
                        const costPrice = toNumber(i.costPrice);
                        const salePrice = toNumber(i.salePrice);
                        const totalCostPrice = toNumber(i.totalCostPrice) || costPrice * quantity;
                        const totalSalePrice = toNumber(i.totalSalePrice) || salePrice * quantity;
                        const totalFreightAmount = toNumber(i.totalFreightAmount);

                        // Evitar incluir la "Bolsa" como producto de contenido
                        const isBag = i.product?.name === "Bolsa";
                        acc.sumItemsByBag += isBag ? 0 : quantity;
                        acc.sumUnitCostPrice += costPrice * quantity;
                        acc.sumUnitSalePrice += salePrice * quantity;
                        acc.sumTotalCostPrice += totalCostPrice;
                        acc.sumTotalSalePrice += totalSalePrice;
                        acc.sumFreightPerProduct += totalFreightAmount;
                        acc.valueProductStock = i.product?.stock ?? acc.valueProductStock;

                        return acc;
                    },
                    {
                        sumItemsByBag: 0,
                        sumUnitCostPrice: 0,
                        sumUnitSalePrice: 0,
                        sumTotalCostPrice: 0,
                        sumTotalSalePrice: 0,
                        sumFreightPerProduct: 0,
                        valueComboUtility: 0,
                        valueProductStock: 0,
                    }
                );

                // Calcular utilidad
                totals.valueComboUtility = totals.sumTotalSalePrice - totals.sumTotalCostPrice;

                const totalsFormatted: Totals = {
                    totalItemsByBag: totals.sumItemsByBag,
                    totalCostByBag: totals.sumUnitCostPrice,
                    totalSaleByBag: totals.sumUnitSalePrice,
                    totalCostAmount: totals.sumTotalCostPrice,
                    totalSaleAmount: totals.sumTotalSalePrice,
                    totalFreightAmount: totals.sumFreightPerProduct,
                    totalProfitAmount: totals.valueComboUtility,
                    totalStockValue: totals.valueProductStock,
                };

                // Formatear el mes de la receta
                const formattedMonth = monthRecipeBag ? moment(monthRecipeBag).format("MMMM YYYY") : "Sin fecha";

                // Retornar estructura completa
                return {
                    id,
                    serialCode,
                    monthRecipeBag: monthRecipeBag,
                    numberBags,
                    operatingExpense,
                    maquila,
                    tax,
                    commission,
                    maquiladors: maquiladors.sort((a, b) => (a.isPrimary === b.isPrimary) ? 0 : a.isPrimary ? -1 : 1),
                    items: itemList,
                    totals: totalsFormatted,
                    payments,
                    warehouse
                } as BagRecipeModel;
            });

            return bagRecipesDetail;
        } catch (error: any) {
            console.error("❌ Error al procesar las recetas:", error.message);
            throw new Error("An error occurred while processing the bag recipes");
        }
    }
}
