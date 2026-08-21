import { Request, Response } from 'express';
import moment from 'moment';
import messages from '../../core/helpers/messages';
import { SummaryBagRecipeDataModel } from '../../core/models/summary-bag-recipe-data.model';
import { HttpResponseService } from '../../core/services/http-response.service';
import { ShipmentService } from '../../core/services/shipment.service';
import { SummaryDataModel } from '../../core/models/summary-data.model';
import { SummaryMonthModel } from '../../core/models/summary-month.model';
import { Shipment } from '../../database/entities/shipment';

export class SummaryShipmentController {
	/**
	 * Control de la respuesta
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlDataControl(req: Request, res: Response) {
		const summaryShipmentController = new SummaryShipmentController();
		const filter: number = Number.parseInt(req.params.filter, 10);
		switch (filter) {
			case 0: summaryShipmentController.ctrlSummaryCurrentMonth(req, res); break;
			case 1: summaryShipmentController.ctrlSummaryMonth(req, res); break;
			case 2: summaryShipmentController.ctrlSummaryTwoMonth(req, res); break;
			case 3: summaryShipmentController.ctrlSummaryQuarter(req, res); break;
			case 4: summaryShipmentController.ctrlSummarySemester(req, res); break;
			case 5: summaryShipmentController.ctrlSummaryYear(req, res); break;
			default: summaryShipmentController.ctrlSummaryCurrentMonth(req, res); break;
		}
	}

	/**
	 * Información resumen mes actual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlSummaryCurrentMonth(req: Request, res: Response) {
		try {
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};

			moment.locale('es');

			// Logic
			const init = moment().startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			data = await summaryShipmentController.getStructureData(init, end);

			console.log('Este es objeto ya arreglado de vuelta', data);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};


			moment.locale('es');

			// Logic
			const init = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
			const end = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

			// Build the info
			data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Información resumen mensual
	 * @param req Solicitud
	 * @param res Respuesta
	 */
	public async ctrlListShipmentSpecificMonth(req: Request, res: Response) {
		try {
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};


			moment.locale('es');

			// Parsea el mes y el año desde el formato MM/YYYY
			const [month, year] = req.params.date.split('/');

			// Construye la fecha usando moment.js
			const dateIni = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
			const dateEnd = moment(`${year}-${month}-01`, 'YYYY-MM-DD').endOf('month');

			// Formatea y obtiene el primer día del mes en formato YYYY-MM-DD
			const init = dateIni.format('YYYY-MM-DD');
			const end = dateEnd.format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};


			moment.locale('es');

			// Logic
			const init = moment().subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
			const end = moment().subtract(2, 'month').endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};

			moment.locale('es');

			// Logic
			const init = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};

			moment.locale('es');

			// Logic
			const init = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			const summaryShipmentController = new SummaryShipmentController();
			let data: SummaryDataModel = {
				shipments: [{
					infoGeneral: {
						bl: '',
						containerQuantity: '',
						containerCapacity: '',
						quantityMetricTons: '',
						arrivalDate: '',
						startDateDelay: '',
						freeDays: '',
						daysLate: '',
						amountPayDelay: '',
						isDelayedShipment: '',
						description: '',
						createdAt: ''
					},
					provider: {},
					entryPort: {},
					brand: {},
					origin: {},
					state: {},
					expenses: {},
					legalRegimes: {},
					observations: {}
				}]
			};


			moment.locale('es');

			// Logic
			const init = moment().startOf('year').format('YYYY-MM-DD');
			const end = moment().endOf('year').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
		} catch (error) {
			HttpResponseService.response(res, 500, error, messages.general.error);
		}
	}

	/**
	 * Obtener la estructura de los datos
	 * @param init Fecha de Inicio
	 * @param end Fecha de Finalización
	 */
	public async getStructureData(init: string, end: string): Promise<SummaryDataModel> {
		try {
			const shipmentService = new ShipmentService();
			const data: SummaryDataModel = {
				shipments: [],
			};

			moment.locale('es');
			const todayDate = moment();

			// Queries
			const shipments = await shipmentService.getByDateFilter(init, end);
			console.log('Aqui es el shipment ya agrupadop por proveedor..............................', shipments)

			console.log('Resultados del Shipment', shipments);

			shipments.forEach((shipment: Shipment) => {
				let numberOfShipments: number = 0;			// Numero total para fecha seleccionada de Envios en general
				let numberShipmentsDelay: number = 0;		// Numero total para fecha seleccionada de Envios con Demora
				let numberDaysDelay: number = 0;				// Numero total para fecha seleccionada de Numero de dias tarde
				let numberShipmentsDispatch: number = 0;	// Numero total para fecha seleccionada de Envios con status de Despachado 
				let numberShipmentsTransit: number = 0;		// Numero total para fecha seleccionada de Envios con status de TRansito 
				let numberShipmentsArriving: number = 0;	// Numero total para fecha seleccionada de Envios con status de Llego 
				let numberQuantityContainer: number = 0;		// Cantidad total para fecha seleccionada de Cantidad de Containers
				let numberCapacityContainer: number = 0;		// Cantidad total para fecha seleccionada de Capacidad de Containers
				let valueMetricTon: number = 0;				// Cantidad total para fecha seleccionada de Toneladas Metricas para los Containers
				let valueAmountPayDelay: any = 0.00; 		// Monto total para fecha seleccionada de Pagos por Demora
				let dataShipment: {};

				numberOfShipments++;
				if (shipment.isDelayedShipment) {
					numberShipmentsDelay++;
					numberDaysDelay += Number(shipment.daysLate);
				}
				numberQuantityContainer += Number(shipment.containerQuantity);
				numberCapacityContainer += Number(shipment.containerCapacity);
				valueMetricTon += Number(shipment.quantityMetricTons);
				valueAmountPayDelay += Number(shipment.amountPayDelay);

				switch (shipment.state.name) {
					case 'Despacho':
						numberShipmentsDispatch++;
						break;
					case 'En Transito':
						numberShipmentsTransit++;
						break;
					case 'Llego':
						numberShipmentsArriving++;
						break;
					default:
						break;
				};

				// Se crea el nuevo objeto
				dataShipment = {
					// Se agregan los totales
					totals: {
						totalNumberShipemnt: numberOfShipments,
						totalShipmentsDelay: numberShipmentsDelay,
						totalDaysDelay: numberDaysDelay,
						totalShipmentsDispatch: numberShipmentsDispatch,
						totalShipmentsTransit: numberShipmentsTransit,
						totalShipmentsArriving: numberShipmentsArriving,
						totalQuantityContainer: numberQuantityContainer,
						totalCapacityContainer: numberCapacityContainer,
						totalMetricTon: valueMetricTon,
						totalAmountPayDelay: valueAmountPayDelay
					}
				}
				// Se agrega el objeto al arreglo
				data.shipments.push(dataShipment);
				dataShipment = {};
			});


			// Objeto para agrupar los envíos por proveedor
			const groupedShipments: { [providerId: string]: { provider: any, shipments: any[] } } = {};

			// Recorre cada envío y agrúpalos por proveedor
			shipments.forEach((shipment) => {
				let numberOfShipments: number = 0;			// Numero total para fecha seleccionada de Envios en general
				let numberShipmentsDelay: number = 0;		// Numero total para fecha seleccionada de Envios con Demora
				let numberDaysDelay: number = 0;				// Numero total para fecha seleccionada de Numero de dias tarde
				let numberShipmentsDispatch: number = 0;	// Numero total para fecha seleccionada de Envios con status de Despachado 
				let numberShipmentsTransit: number = 0;		// Numero total para fecha seleccionada de Envios con status de TRansito 
				let numberShipmentsArriving: number = 0;	// Numero total para fecha seleccionada de Envios con status de Llego 
				let numberQuantityContainer: number = 0;		// Cantidad total para fecha seleccionada de Cantidad de Containers
				let numberCapacityContainer: number = 0;		// Cantidad total para fecha seleccionada de Capacidad de Containers
				let valueMetricTon: number = 0;				// Cantidad total para fecha seleccionada de Toneladas Metricas para los Containers
				let valueAmountPayDelay: any = 0.00; 		// Monto total para fecha seleccionada de Pagos por Demora
				let dataShipment: {};

				numberOfShipments++;
				if (shipment.isDelayedShipment) {
					numberShipmentsDelay++;
					numberDaysDelay += Number(shipment.daysLate);
				}
				numberQuantityContainer += Number(shipment.containerQuantity);
				numberCapacityContainer += Number(shipment.containerCapacity);
				valueMetricTon += Number(shipment.quantityMetricTons);
				valueAmountPayDelay += Number(shipment.amountPayDelay);

				switch (shipment.state.name) {
					case 'Despacho':
						numberShipmentsDispatch++;
						break;
					case 'En Transito':
						numberShipmentsTransit++;
						break;
					case 'Llego':
						numberShipmentsArriving++;
						break;
					default:
						break;
				};
				const providerId = shipment.provider.id;

				// Si el proveedor aún no está en el objeto, inicializa un array
				if (!groupedShipments[providerId]) {
					groupedShipments[providerId] = {
						provider: shipment.provider,
						shipments: [{
							totalNumberShipemnt: numberOfShipments,
							totalShipmentsDelay: numberShipmentsDelay,
							totalDaysDelay: numberDaysDelay,
							totalShipmentsDispatch: numberShipmentsDispatch,
							totalShipmentsTransit: numberShipmentsTransit,
							totalShipmentsArriving: numberShipmentsArriving,
							totalQuantityContainer: numberQuantityContainer,
							totalCapacityContainer: numberCapacityContainer,
							totalMetricTon: valueMetricTon,
							totalAmountPayDelay: valueAmountPayDelay
						}]
					};
				}

				// Agrega el envío actual al array de envíos del proveedor correspondiente
				groupedShipments[providerId].shipments.push(shipment);
			});

			// Resultado final
			console.log('Aqui es el shipment ya agrupadop por proveedor..................groupedShipments............', groupedShipments);


			// Graph Data
			const months: SummaryMonthModel[] = [];
			shipments.forEach((shipment: Shipment) => {

				// Check months
				const currentMonth = moment(shipment.createdAt).format('MMM');
				let finded = false;
				months.forEach((element: SummaryMonthModel) => {
					if (element.name === currentMonth) { finded = true; }
				});

				// Add months
				if (!finded) {
					months.push({
						id: moment(shipment.createdAt).get('month'),
						name: currentMonth,
						value: 1,
					});
				} else {
					months.forEach((element: SummaryMonthModel) => {
						if (element.name === currentMonth) { element.value++; }
					});
				}
			});

			// Order object
			months.sort((e1, e2) => e1.id - e2.id);
			console.log('Arreglo de los meses', months)

			// Add data
			months.forEach((element: SummaryMonthModel) => {
				console.log('Este es el elemento', element.name);
				/*data.lineChartOptions.xaxis[0].categories.push(element.name);
				data.lineChartOptions.series.data.push(element.value);
				data.areaChartOptions.label.push(element.name);
				data.areaChartOptions.series.push(element.value); */
			});

			// Return data
			return data;
		} catch (error) {
			console.log(error);
		}
	}
}
