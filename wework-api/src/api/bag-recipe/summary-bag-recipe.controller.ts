import { Request, Response } from "express";
import { BagRecipe } from "../../database/entities/bag-recipe";
import { SummaryBagRecipeDataModel } from "../../core/models/summary-bag-recipe-data.model";
import { HttpResponseService } from "../../core/services/http-response.service";
import { BagRecipeService } from "../../core/services/bag-recipe.service";
import messages from "../../core/helpers/messages";
import moment from "moment";

export class SummaryBagRecipeController {
	/**
	 * Control de la respuesta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlDataControl(req: Request, res: Response) {
		const summaryBagRecipeController = new SummaryBagRecipeController();
		const filter: number = Number.parseInt(req.params.filter, 10);
		switch (filter) {
			case 0:
				summaryBagRecipeController.ctrlSummaryCurrentMonth(req, res);
				break;
			case 1:
				summaryBagRecipeController.ctrlSummaryMonth(req, res);
				break;
			case 2:
				summaryBagRecipeController.ctrlSummaryTwoMonth(req, res);
				break;
			case 3:
				summaryBagRecipeController.ctrlSummaryQuarter(req, res);
				break;
			case 4:
				summaryBagRecipeController.ctrlSummarySemester(req, res);
				break;
			case 5:
				summaryBagRecipeController.ctrlSummaryYear(req, res);
				break;
			default:
				summaryBagRecipeController.ctrlSummaryCurrentMonth(req, res);
				break;
		}
	}

	/**
	 * Información resumen mes actual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryCurrentMonth(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};
			moment.locale("es");

			// Logic
			const init = moment().startOf("month").format("YYYY-MM-DD");
			const end = moment().endOf("month").format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen mensual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryMonth(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Logic
			const init = moment()
				.subtract(1, "month")
				.startOf("month")
				.format("YYYY-MM-DD");
			const end = moment()
				.subtract(1, "month")
				.endOf("month")
				.format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen mensual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListByBagRecipeSpecificMonth(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Parsea el mes y el año desde el formato MM/YYYY
			const [month, year] = req.params.date.split("/");

			// Construye la fecha usando moment.js
			const dateIni = moment(`${year}-${month}-01`, "YYYY-MM-DD");
			const dateEnd = moment(`${year}-${month}-01`, "YYYY-MM-DD").endOf(
				"month"
			);

			// Formatea y obtiene el primer día del mes en formato YYYY-MM-DD
			const init = dateIni.format("YYYY-MM-DD");
			const end = dateEnd.format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(
				res,
				200,
				data,
				messages.summaryBagRecipe.summaryBagRecipeSuccess
			);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen mensual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryTwoMonth(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Logic
			const init = moment()
				.subtract(2, "month")
				.startOf("month")
				.format("YYYY-MM-DD");
			const end = moment()
				.subtract(2, "month")
				.endOf("month")
				.format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen trimestral
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryQuarter(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Logic
			const init = moment()
				.subtract(3, "months")
				.startOf("month")
				.format("YYYY-MM-DD");
			const end = moment().endOf("month").format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen semestral
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummarySemester(req: Request, res: Response) {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Logic
			const init = moment()
				.subtract(6, "months")
				.startOf("month")
				.format("YYYY-MM-DD");
			const end = moment().endOf("month").format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen anual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryYear(req: Request, res: Response): Promise<void> {
		try {
			const summaryBagRecipeController = new SummaryBagRecipeController();
			let data: SummaryBagRecipeDataModel = {
				recipes: [
					{
						perBag: {
							bagAtCostPrice: 0.0, // Se suman todos los precios al costo
							bagAtSalesPrice: 0.0, // Se suman todos los precios de entrega
							comboCost: 0.0, // Se saca Sumando unitCostPrice mas  operatingExpense (Gasto Operativo)
							comboUtility: 0.0, // Se resta  unitSalesPrice menos  unitCostPrice
						},
						totals: {
							totalNumberBags: 0, // Numero de bolsas
							totalProductsBag: 0, // Numero de productos totales
							totaPriceCost: 0.0, // Se suman todos los precios al costo
							totalSalePrice: 0.0, // Se suman todos los precios de ntrega
							netProfit: 0.0, // Se multiplica numberBags (Numero bolsas) por comboUtility (Utilidad Combo)  esto es (UTILIDAD NETA)
							totalCommission: 0.0, // Se multiplica numberBags (Numero bolsas)  por commission (Comision en su tabla) esto es (Comision)
							billingAmount: 0.0, // Se multiplica numberBags (Numero bolsas) por unitSalesPrice (Precio entrega)  esto es (MONTO FACTURACION)
							billingAmountLessCommission: 0.0, // Se resta billingAmount menos totalCommission esto es (Facturacion - Total Comision)
							totalFreightForProduct: 0.0, // Se suman todos ños totalFreightForProduct esto es (Total flete)
						},
						items: [],
					},
				],
			};

			moment.locale("es");

			// Logic
			const init = moment().startOf("year").format("YYYY-MM-DD");
			const end = moment().endOf("year").format("YYYY-MM-DD");

			// Build the info
			data = await summaryBagRecipeController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryBagRecipe.summaryBagRecipeSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Obtener la estructura de los datos
	 * @param init Fecha de Inicio
	 * @param end Fecha de Finalización
	 */
	public async getStructureData(init: string, end: string): Promise<SummaryBagRecipeDataModel> {
		try {
			const bagRecipeService = new BagRecipeService();
			const data: SummaryBagRecipeDataModel = {
				recipes: [],
			};

			moment.locale("es");
			const todayDate = moment();

			// Queries
			const resultBagRecipe = await bagRecipeService.getByDateFilter(init, end);

			// Filtrar los productos de cada receta directamente en el objeto original
			resultBagRecipe.forEach((recipe) => {
				recipe.items = recipe.items.filter(
					(item) => item.quantity > 0
				);
			});

			resultBagRecipe.forEach((bagRecipe: BagRecipe, i) => {
				let sumProductForBag: number = 0.0;
				let sumUnitCostPrice: number = 0.0;
				let sumTotalCostPrice: number = 0.0;
				let sumUnitSalePrice: number = 0.0;
				let sumTotalSalePrice: number = 0.0;
				let valueComboCost: number = 0.0;
				let valueComboSale: number = 0.0;
				let valueComboUtility: number = 0.0;
				let valueTotalNumberBags: number = 0;
				let valueTotalNumberItems: number = 0;
				let sumFreightForProduct: number = 0.0;
				let valueBillingAmount: number = 0.0;
				let valueTotalCommission: number = 0.0;
				let valueSeriePie: any = [];
				let valueLabelPie: any = [];
				let valueAmountMaquiladorMajor: number = 0;
				let valueAmountMaquiladorCooperator: number = 0;
				let valueAmountDollarsMaquiladorMajor: number = 0.0;
				let valueAmountDollarsMaquiladorCooperator: number = 0.0;
				let valueProductMaquiladorMajor: any = [];
				let valueProductMaquiladorCooperator: any = [];
				let dataRecipe: {};

				bagRecipe.items.forEach((p: any) => {
					sumProductForBag += p.product.name !== "Bolsa" ? Number(p.productQuantity) : 0;
					sumUnitCostPrice += Number(p.priceProduct) * Number(p.productQuantity);
					sumTotalCostPrice += Number(p.totalCostPrice);
					sumUnitSalePrice += Number(p.priceSale) * Number(p.productQuantity);
					sumTotalSalePrice += Number(p.totalSalePrice);
					sumFreightForProduct += Number(p.totalFreightForProduct);
					valueAmountMaquiladorMajor += Number(p.amountMaquiladorMajor);
					console.log('Nombre del producto', p.product.name)
					console.log('Montos para el maquilador cooperador', p.amountMaquiladorCooperator)
					valueAmountMaquiladorCooperator += Number(p.amountMaquiladorCooperator);
					valueAmountDollarsMaquiladorMajor += Number(p.amountDollarsMaquiladorMajor);
					valueAmountDollarsMaquiladorCooperator += Number(p.amountDollarsMaquiladorCooperator);
					valueTotalNumberItems += p.product.name !== "Bolsa" ? Number(p.quantityProductRequired) : 0;
					if (p.productQuantity > 0) {
						// Si el producto tiene un valor a 0 se incluye a la gráfica
						valueSeriePie.push(p.quantityProductRequired);
						valueLabelPie.push(p.product.name);
					}
					if (Number(p.amountMaquiladorMajor) > 0) {
						valueProductMaquiladorMajor.push({
							name: p.product.name,
							quantity: p.amountMaquiladorMajor,
						});
					} else if (Number(p.amountMaquiladorCooperator) > 0) {
						valueProductMaquiladorCooperator.push({
							name: p.product.name,
							quantity: p.amountMaquiladorCooperator,
						});
					}
				});
				valueComboCost = sumUnitCostPrice == 0 ? 0.0 : sumUnitCostPrice + Number(bagRecipe.operatingExpense) + Number(bagRecipe.maquila);
				valueComboSale = sumUnitSalePrice == 0 ? 0.0 : sumUnitSalePrice + Number(bagRecipe.tax) + Number(bagRecipe.commission);
				valueTotalNumberBags = bagRecipe.numberBags;
				valueComboUtility = valueComboSale - Number(valueComboCost);
				valueBillingAmount = sumTotalSalePrice;
				valueTotalCommission = valueTotalNumberBags * Number(bagRecipe.commission);

				// Se crea el nuevo objeto
				dataRecipe = {
					// Se agregan por unidad
					perBag: {
						serialCode: bagRecipe.serialCode, // Serial de la Receta
						productForBag: sumProductForBag, // Cantida de productos por Bolsa
						monthRecipe: bagRecipe.monthRecipeBag, // Mes de fabricación de ls Receta
						operatingExpense: bagRecipe.operatingExpense, // Valor del gasto operativo por Bolsa
						maquila: bagRecipe.maquila, // Valor de la waquila por Bolsa
						tax: bagRecipe.tax, // Valor del impueto por Bolsa
						commission: bagRecipe.commission, // Valor de la Comision por Bolsa
						maquiladors: bagRecipe.maquiladors, // Representa los Maquiladores de la bolsa
						bagAtCostPrice: sumUnitCostPrice, // Precio a costo por Bolsa
						bagAtSalesPrice: sumUnitSalePrice, // Precio para venta por Bolsa  (Precio a costo mas Impuesto y Comision)
						comboCost: valueComboCost ? valueComboCost : 0.0, // Precio a costo mas gatos por Bolsa (Precioa a costo mas Gastos Operativos y Maquilado)
						comboUtility: valueComboUtility, // Monto de utilidad por Bolsa (Es el resultado de Restar el precio para venta - el precio del combo a costo con sus gastos)
					},
					// Se agregan los totales
					totals: {
						totalNumberBags: valueTotalNumberBags,
						totalProductsBag: valueTotalNumberItems,
						totalCostPrice: sumTotalCostPrice,
						totalSalePrice: sumTotalSalePrice,
						netProfit: valueTotalNumberBags * valueComboUtility,
						totalCommission: valueTotalCommission,
						billingAmount: valueBillingAmount,
						billingAmountLessCommission: valueBillingAmount > 0 ? valueBillingAmount - Number(valueTotalCommission) : 0.0,
						totalFreightForProduct: sumFreightForProduct,
						amountMaquiladorMajor: valueAmountMaquiladorMajor,
						amountMaquiladorCooperator: valueAmountMaquiladorCooperator,
						amountDollarsMaquiladorMajor: valueAmountDollarsMaquiladorMajor,
						amountDollarsMaquiladorCooperator: valueAmountDollarsMaquiladorCooperator,
						infoProductMaquiladorMajor: valueProductMaquiladorMajor,
						infoProductMaquiladorCooperator: valueProductMaquiladorCooperator,
					},
					items: bagRecipe.items,
					//surcharge: bagRecipe.surcharges[0],
					payments: bagRecipe.payments,
					pieChartOptions: {
						series: valueSeriePie,
						chart: {
							type: "donut",
							width: 300,
						},
						legend: {
							show: false,
						},
						dataLabels: {
							enabled: true,
						},
						labels: valueLabelPie,
						responsive: [
							{
								breakpoint: 480,
								options: {},
							},
						],
					},
				};

				// Se agrega el objeto al arreglo
				data.recipes.push(dataRecipe);
				dataRecipe = {};
			});

			// Return data
			return data;
		} catch (error) {
			console.log(error);
		}
	}
}
