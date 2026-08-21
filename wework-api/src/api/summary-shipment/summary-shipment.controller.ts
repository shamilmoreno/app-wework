import { Request, Response } from 'express';
import moment from 'moment';
import messages from '../../core/helpers/messages';
import { Shipment } from './../../database/entities/shipment';
import { SummaryDataModel } from '../../core/models/summary-data.model';
import { SummaryMonthModel } from '../../core/models/summary-month.model';
import { HttpResponseService } from '../../core/services/http-response.service';
import { ShipmentService } from '../../core/services/shipment.service';

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
			case 2: summaryShipmentController.ctrlSummaryQuarter(req, res); break;
			case 3: summaryShipmentController.ctrlSummarySemester(req, res); break;
			case 4: summaryShipmentController.ctrlSummaryYear(req, res); break;
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
			/* let data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Aqui van los Clientes
							data: [], // Aqui van los embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Aqui van los meses
						title: {
							text: 'Mes',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [], //
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: [], // Aqui van los meses
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			}; */
			moment.locale('es');

			// Logic
			const init = moment().startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			//HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
			/* let data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Van ek Cliete 
							data: [] // Van los Embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Van los Meses del embarque
						title: {
							text: 'Meses',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [],
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: ['Despacho', 'En Transito', 'Llego', 'Demora'],
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			}; */

			moment.locale('es');

			// Logic
			const init = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
			const end = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			//HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
		/* 	let data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Van ek Cliete 
							data: [] // Van los Embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Van los Meses del embarque
						title: {
							text: 'Meses',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [],
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: ['Despacho', 'En Transito', 'Llego', 'Demora'],
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			};
 */
			moment.locale('es');

			// Logic
			const init = moment().subtract(3, 'months').startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			//HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
		/* 	let data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Van ek Cliete 
							data: [] // Van los Embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Van los Meses del embarque
						title: {
							text: 'Meses',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [],
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: ['Despacho', 'En Transito', 'Llego', 'Demora'],
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			}; */

			moment.locale('es');


			// Logic
			const init = moment().subtract(6, 'months').startOf('month').format('YYYY-MM-DD');
			const end = moment().endOf('month').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			//HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
		/* 	let data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Van ek Cliete 
							data: [] // Van los Embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Van los Meses del embarque
						title: {
							text: 'Meses',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [],
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: ['Despacho', 'En Transito', 'Llego', 'Demora'],
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			};
 */
			moment.locale('es');

			// Logic
			const init = moment().startOf('year').format('YYYY-MM-DD');
			const end = moment().endOf('year').format('YYYY-MM-DD');

			// Build the info
			//data = await summaryShipmentController.getStructureData(init, end);

			// Response
			//HttpResponseService.response(res, 200, data, messages.summaryShipment.summaryShipmentSuccess);
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
		/* 	const data: SummaryDataModel = {
				numberOfShipments: 0,
				numberShipmentsDispatch: 0,
				numberShipmentsTransit: 0,
				numberShipmentsArriving: 0,
				numberShipmentsDelay: 0,
				totalDaysDelay: 0,
				totalQuantityContainer: 0,
				totalCapacityContainer: 0,
				totalMetricTon: 0,
				totalAmountPayDelay: 0.00,
				lineChartOptions: {
					series: [
						{
							name: '', // Van ek Cliete 
							data: [] // Van los Embarques del cliente por mes
						}
					],
					chart: {
						height: 270,
						type: 'line',
						foreColor: '#9aa0ac',
						dropShadow: {
							enabled: true,
							color: '#000',
							top: 18,
							left: 7,
							blur: 10,
							opacity: 0.2,
						},
						toolbar: {
							show: false,
						},
					},
					colors: ['#9F78FF', '#858585'],
					stroke: {
						curve: 'smooth',
					},
					grid: {
						row: {
							colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
							opacity: 0.5,
						},
					},
					markers: {
						size: 3,
					},
					xaxis: {
						categories: [], // Van los Meses del embarque
						title: {
							text: 'Meses',
						},
					},
					yaxis: {
						min: 5,
						max: 40,
					},
					legend: {
						position: 'top',
						horizontalAlign: 'right',
						floating: true,
						offsetY: -25,
						offsetX: -5,
					},
					tooltip: {
						theme: 'dark',
						marker: {
							show: true,
						},
						x: {
							show: true,
						},
					},
				},
				pieChartOptions: {
					series: [],
					chart: {
						type: 'donut',
						width: 200,
					},
					legend: {
						show: false,
					},
					dataLabels: {
						enabled: false,
					},
					labels: ['Despacho', 'En Transito', 'Llego', 'Demora'],
					responsive: [
						{
							breakpoint: 400,
							options: {},
						},
					],
				},
				areaChartOptions: {
					series: [
						{
							name: 'Mathes',
							data: [31, 40, 28, 51, 42, 85, 77],
						},
						{
							name: 'Science',
							data: [11, 32, 45, 32, 34, 52, 41],
						},
					],
					chart: {
						height: 350,
						type: 'area',
						toolbar: {
							show: false,
						},
						foreColor: '#9aa0ac',
					},
					colors: ['#F77A9A', '#A054F7'],
					dataLabels: {
						enabled: false,
					},
					stroke: {
						curve: 'smooth',
					},
					xaxis: {
						categories: [
							'test 1',
							'test 2',
							'test 3',
							'test 4',
							'test 5',
							'test 6',
							'test 7',
						],
					},
					legend: {
						show: true,
						position: 'top',
						horizontalAlign: 'center',
						offsetX: 0,
						offsetY: 0,
					},
				}
			};
 */
			moment.locale('es');
			const todayDate = moment();

			// Queries
			const resultShipments = await shipmentService.getByDateFilter(init, end);

			// Calculate
			let numberOfShipments: number = 0;
			let numberShipmentsDispatch: number = 0;
			let numberShipmentsTransit: number = 0;
			let numberShipmentsArriving: number = 0;
			let numberShipmentsDelay: number = 0;
			let totalDaysDelay: number = 0;
			let totalAmountPayDelay: number = 0;
			let totalQuantityContainer: number = 0;
			let totalCapacityContainer: number = 0;
			let totalMetricTon: number = 0;
			console.log('aqui mi embarque', resultShipments);

			resultShipments.forEach((shipment: Shipment) => {
				totalQuantityContainer += Number(shipment.containerQuantity);
				totalCapacityContainer += Number(shipment.containerCapacity);
				totalMetricTon += Number(shipment.quantityMetricTons);
				totalAmountPayDelay += Number(shipment.amountPayDelay);

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

				if (shipment.isDelayedShipment) {
					numberShipmentsDelay++;
					totalDaysDelay += Number(shipment.daysLate);
				}
			});

			// Graph Data
			const months: SummaryMonthModel[] = [];
			resultShipments.forEach((shipment: Shipment) => {

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

			// Result
		/* 	data.numberOfShipments = resultShipments.length;
			data.numberShipmentsDispatch = numberShipmentsDispatch;
			data.numberShipmentsTransit = numberShipmentsTransit;
			data.numberShipmentsArriving = numberShipmentsArriving;
			data.numberShipmentsDelay = numberShipmentsDelay;
			data.totalDaysDelay = totalDaysDelay;
			data.totalAmountPayDelay = totalAmountPayDelay;
			data.totalQuantityContainer = totalQuantityContainer;
			data.totalCapacityContainer = totalCapacityContainer;
			data.totalMetricTon = totalMetricTon;
			data.pieChartOptions.series = [numberShipmentsDispatch, numberShipmentsTransit, numberShipmentsArriving, numberShipmentsDelay]

			console.log('Esta es mi data ya estructurada', data.pieChartOptions) */

			// Return data
			/* return data; */
			return null;
		} catch (error) {
			console.log(error);
		}
	}
}
