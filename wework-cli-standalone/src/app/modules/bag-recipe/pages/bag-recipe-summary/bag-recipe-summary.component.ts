import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { PieChartOptionsModel } from '@core/models/pie-chart-options.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@envs/environment';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
const moment = _rollupMoment || _moment;
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_MONTH_YEAR_FORMATS } from '@shared/constants/date-formats';

// ANGULAR MATERIALL
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

// MODELS
import { ResponseModel } from '@core/models/response.model';

// SERVICES
import { BagRecipeService } from '@core/services/bag.recipe-service';
import { PdfExportService } from '@core/services/pdf-export.service';

export type barChartOptions = {
	series?: ApexAxisChartSeries;
	chart?: ApexChart;
	dataLabels?: ApexDataLabels;
	plotOptions: ApexPlotOptions;
	responsive?: ApexResponsive[];
	xaxis?: ApexXAxis;
	legend?: ApexLegend;
	fill?: ApexFill;
};


export type areaChartOptions = {
	series?: ApexAxisChartSeries;
	chart?: ApexChart;
	xaxis?: ApexXAxis;
	yaxis?: ApexYAxis;
	stroke?: ApexStroke;
	tooltip?: ApexTooltip;
	dataLabels?: ApexDataLabels;
	legend?: ApexLegend;
	colors?: string[];
};

@Component({
	selector: 'app-bag-recipe-summary',
	standalone: true,
	imports: [
		CommonModule,
		BreadcrumbComponent,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		MatDatepickerModule,
		MatExpansionModule,
		MatTabsModule,
		MatIconModule,
		NgApexchartsModule,
		MatInputModule,
		MatMomentDateModule
	],
	providers: [
		provideMomentDateAdapter(MY_MONTH_YEAR_FORMATS),
	],
	templateUrl: './bag-recipe-summary.component.html',
	styleUrl: './bag-recipe-summary.component.scss'
})


export class BagRecipeSummaryComponent {
	@ViewChild('dashboardContent')
	dashboardContent!: ElementRef;
	@ViewChild('chart')
	chart!: ChartComponent;
	public barChartOptions!: Partial<barChartOptions>;
	public areaChartOptions!: Partial<areaChartOptions>;
	public pieChartOptions: Partial<PieChartOptionsModel> | undefined;
	public selectedOptionName: string = 'Mes en curso';
	public filters: any[] = [];
	public filterSelected: number = 0;
	public maizalList: any = [];
	public evalsaList: any = [];
	public xieYenList: any = [];
	public recipeList: any = [];
	public breadscrums = [
		{
			title: 'Tablero',
			items: ['Resumen Receta'],
			active: 'Tablero',
		},
	];
	public bagRecipeForm!: FormGroup;
	public imagePathServer = `${environment.server}`;
	public maxDate: moment.Moment = moment();

	constructor(
		private formBuilder: FormBuilder,
		private bagRecipeService: BagRecipeService,
		private pdfExportService: PdfExportService
	) { }

	ngOnInit() {
		this.filterSelected = 0;

		this.filters = [
			// ... tus filtros
		];

		this.buildForm();

		this.chart3();
	}

	get f() { return this.bagRecipeForm.controls; }

	public buildForm() {
		this.bagRecipeForm = this.formBuilder.group({
			resumeForm: this.formBuilder.group({
				mounthRecipe: [''],
				periodRecipe: [''],
				periodStartDate: [''],
				periodEndDate: ['']
			})
		});
	}

	public setMonthAndYear(
		normalizedMonthAndYear: moment.Moment,
		datepicker: MatDatepicker<moment.Moment>,
	) {
		// 1. Obtener el control del formulario
		const control = this.bagRecipeForm.get('resumeForm.mounthRecipe');

		if (control) {
			const ctrlValue = control.value ? moment(control.value) : moment();

			ctrlValue.month(normalizedMonthAndYear.month());
			ctrlValue.year(normalizedMonthAndYear.year());

			control.setValue(ctrlValue.format('YYYY-MM-DD'));

			this.filterChangeSpecificMonth(moment(ctrlValue).format('MM/YYYY'));
		}

		datepicker.close();
	}

	public exportToPDF(recipe: any) {
		//console.log('Este es el recipe a esxportar a pdf', recipe);
		this.pdfExportService.exportToPdfRecipeResume(recipe);
	}

	// Doughnut chart start
	public doughnutChartLabels: string[] = [
		'Development',
		'Java Classes',
		'Painting ',
		'Geography Class',
	];

	public doughnutChartData: number[] = [32, 25, 20, 23];

	public doughnutChartColors: any[] = [
		{
			backgroundColor: ['#5A5FAF', '#F7BF31', '#EA6E6C', '#28BDB8'],
		},
	];

	public doughnutChartType = 'doughnut';

	public doughnutChartOptions: any = {
		animation: false,
		responsive: true,
		maintainAspectRatio: false,
		cutoutPercentage: 70,
		legend: {
			display: false,
		},
	};

	public filterChange() { 
		const startDate = this.bagRecipeForm.get('resumeForm.periodStartDate')?.value;
		const endDate = this.bagRecipeForm.get('resumeForm.periodEndDate')?.value;

		if (!startDate || !endDate) {
			return;
		}

		this.bagRecipeForm.get('resumeForm.mounthRecipe')?.setValue('');
		this.recipeList = [];

		const startFormatted = startDate.format('YYYY-MM-DD');
		const endFormatted = endDate.format('YYYY-MM-DD');

		const dateRangeValue = {
			startDate: startFormatted,
			endDate: endFormatted
		};

		this.bagRecipeService.getSummary(dateRangeValue).subscribe({
			next: (rm: ResponseModel) => {
				rm.response.recipes.forEach((m: any, i: any) => {
					console.log('Estas son las opciones del gráfico', m.pieChartOptions);
					let recipe = {
						perBag: {
							serialCode: m.perBag.serialCode,
							maquiladors: m.perBag.maquiladors,
							productForBag: m.perBag.productForBag,
							monthRecipe: moment(m.perBag.monthRecipe).format('MMM YYYY'),
							operatingExpense: m.perBag.operatingExpense,
							maquila: m.perBag.maquila,
							tax: m.perBag.tax,
							commission: m.perBag.commission,
							unitCostPrice: m.perBag.bagAtCostPrice,
							unitSalesPrice: m.perBag.bagAtSalesPrice,
							comboCost: m.perBag.comboCost,
							comboUtility: m.perBag.comboUtility,
						},
						totals: {
							totalNumberBags: m.totals.totalNumberBags,
							totalProductsBag: m.totals.totalProductsBag,
							totalCostPrice: m.totals.totalCostPrice,
							totalSalePrice: m.totals.totalSalePrice,
							netProfit: m.totals.netProfit,
							billingAmount: m.totals.billingAmount,
							totalBillingAmount: m.totals.billingAmount,
							totalCommission: m.totals.totalCommission,
							billingAmountLessCommission: m.totals.billingAmountLessCommission,
							totalFreightForProduct: m.totals.totalFreightForProduct,
							amountMaquiladorMajor: m.totals.amountMaquiladorMajor,
							amountMaquiladorCooperator: m.totals.amountMaquiladorCooperator,
							amountDollarsMaquiladorMajor: m.totals.amountDollarsMaquiladorMajor,
							amountDollarsMaquiladorCooperator: m.totals.amountDollarsMaquiladorCooperator,
							infoProductMaquiladorMajor: m.totals.infoProductMaquiladorMajor,
							infoProductMaquiladorCooperator: m.totals.infoProductMaquiladorCooperator
						},
						products: m.products,
						payments: m.payments,
						pieChartOptions: {
							...(m.pieChartOptions ?? {}),
							tooltip: {
								enabled: true,
								y: {
									formatter: function (val: number, opts: any) {
										const label = opts.w.globals.labels[opts.seriesIndex];
										const porcentaje = opts.w.globals.seriesPercent[opts.seriesIndex][0].toFixed(1);
										const formattedVal = new Intl.NumberFormat('es-VE').format(val);
										return `${label}: ${formattedVal} (${porcentaje}%)`;
									}
								}
							},
							dataLabels: {
								enabled: true,
								formatter: function (val: number, opts: any) {
									const porcentaje = opts.w.globals.seriesPercent[opts.seriesIndex][0].toFixed(1);
									return `${porcentaje}%`;
								}
							}
						}
					};
					this.recipeList.push(recipe);
				});
			},
			error: err => {
				const error: ResponseModel = err.error;
				Swal.fire({
					title: error.message,
					icon: 'info',
				});
			},
		});
	}

	/* public filterChange(event: MatSelectChange) {
		// Reset the date input
		this.bagRecipeForm.get('resumeForm.mounthRecipe')?.setValue('');
		this.recipeList = [];

		this.bagRecipeService.getSummary(event.value).subscribe({
			next: (rm: ResponseModel) => {
				rm.response.recipes.forEach((m: any, i: any) => {
					console.log('Estas son loas opciones del grfico', m.pieChartOptions)
					let recipe = {
						perBag: {
							serialCode: m.perBag.serialCode,
							maquiladors: m.perBag.maquiladors,
							productForBag: m.perBag.productForBag,
							monthRecipe: moment(m.perBag.monthRecipe).format('MMM YYYY'),
							operatingExpense: m.perBag.operatingExpense,
							maquila: m.perBag.maquila,
							tax: m.perBag.tax,
							commission: m.perBag.commission,
							unitCostPrice: m.perBag.bagAtCostPrice,
							unitSalesPrice: m.perBag.bagAtSalesPrice,
							comboCost: m.perBag.comboCost,
							comboUtility: m.perBag.comboUtility,
						},
						totals: {
							totalNumberBags: m.totals.totalNumberBags,
							totalProductsBag: m.totals.totalProductsBag,
							totalCostPrice: m.totals.totalCostPrice,
							totalSalePrice: m.totals.totalSalePrice,
							netProfit: m.totals.netProfit,
							billingAmount: m.totals.billingAmount,
							totalBillingAmount: m.totals.billingAmount,
							totalCommission: m.totals.totalCommission,
							billingAmountLessCommission: m.totals.billingAmountLessCommission,
							totalFreightForProduct: m.totals.totalFreightForProduct,
							amountMaquiladorMajor: m.totals.amountMaquiladorMajor,
							amountMaquiladorCooperator: m.totals.amountMaquiladorCooperator,
							amountDollarsMaquiladorMajor: m.totals.amountDollarsMaquiladorMajor,
							amountDollarsMaquiladorCooperator: m.totals.amountDollarsMaquiladorCooperator,
							infoProductMaquiladorMajor: m.totals.infoProductMaquiladorMajor,
							infoProductMaquiladorCooperator: m.totals.infoProductMaquiladorCooperator
						},
						products: m.products,
						payments: m.payments,
						//pieChartOptions: m.pieChartOptions
						pieChartOptions: {
							...(m.pieChartOptions ?? {}),
							tooltip: {
								enabled: true,
								y: {
									formatter: function (val: number, opts: any) {
										const label = opts.w.globals.labels[opts.seriesIndex];
										const porcentaje = opts.w.globals.seriesPercent[opts.seriesIndex][0].toFixed(1);
										const formattedVal = new Intl.NumberFormat('es-VE').format(val);
										return `${label}: ${formattedVal} (${porcentaje}%)`;
									}
								}
							},
							dataLabels: {
								enabled: true,
								formatter: function (val: number, opts: any) {
									const porcentaje = opts.w.globals.seriesPercent[opts.seriesIndex][0].toFixed(1);
									return `${porcentaje}%`;
								}
							}
						}

					}
					this.recipeList.push(recipe)
				});
			},
			error: err => {
				// Guardo el error en una variable para mostrarlo posteriormente
				const error: ResponseModel = err.error;

				// Mostrando un mensaje de error
				Swal.fire({
					title: error.message,
					icon: 'info',
				});
			},
		});
	} */

	public filterChangeSpecificMonth(date: any) {
		this.recipeList = [];
		//console.log('Esta es la fecha', date)

		this.bagRecipeService.getSummarySpecificMonth(date).subscribe({
			next: (rm: ResponseModel) => {
				moment.locale('es');
				rm.response.recipes.forEach((m: any, i: any) => {
					let recipe = {
						perBag: {
							serialCode: m.perBag.serialCode,
							maquiladors: m.perBag.maquiladors,
							productForBag: m.perBag.productForBag,
							monthRecipe: moment(m.perBag.monthRecipe).format('MMM YYYY'),
							operatingExpense: m.perBag.operatingExpense,
							maquila: m.perBag.maquila,
							tax: m.perBag.tax,
							commission: m.perBag.commission,
							unitCostPrice: m.perBag.bagAtCostPrice,
							unitSalesPrice: m.perBag.bagAtSalesPrice,
							comboCost: m.perBag.comboCost,
							comboUtility: m.perBag.comboUtility,
						},
						totals: {
							totalNumberBags: m.totals.totalNumberBags,
							totalProductsBag: m.totals.totalProductsBag,
							totalCostPrice: m.totals.totalCostPrice,
							totalSalePrice: m.totals.totalSalePrice,
							netProfit: m.totals.netProfit,
							billingAmount: m.totals.billingAmount,
							totalBillingAmount: m.totals.billingAmount,
							totalCommission: m.totals.totalCommission,
							billingAmountLessCommission: m.totals.billingAmountLessCommission,
							totalFreightForProduct: m.totals.totalFreightForProduct,
							amountMaquiladorMajor: m.totals.amountMaquiladorMajor,
							amountMaquiladorCooperator: m.totals.amountMaquiladorCooperator,
							amountDollarsMaquiladorMajor: m.totals.amountDollarsMaquiladorMajor,
							amountDollarsMaquiladorCooperator: m.totals.amountDollarsMaquiladorCooperator,
							infoProductMaquiladorMajor: m.totals.infoProductMaquiladorMajor,
							infoProductMaquiladorCooperator: m.totals.infoProductMaquiladorCooperator
						},
						products: m.products,
						payments: m.payments,
						pieChartOptions: m.pieChartOptions
					}
					this.recipeList.push(recipe)
				});
			},
			error: err => {
				// Guardo el error en una variable para mostrarlo posteriormente
				const error: ResponseModel = err.error;

				// Mostrando un mensaje de error
				Swal.fire({
					title: error.message,
					icon: 'info',
				});
			},
		});
	}

	private chart1() {
		this.areaChartOptions = {
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
		};
	}

	private chart2() {
		this.barChartOptions = {
			series: [
				{
					name: 'Physics',
					data: [44, 55, 41, 67, 22, 43],
				},
				{
					name: 'Computer',
					data: [13, 23, 20, 8, 13, 27],
				},
				{
					name: 'Management',
					data: [11, 17, 15, 15, 21, 14],
				},
				{
					name: 'Mathes',
					data: [21, 7, 25, 13, 22, 8],
				},
			],
			chart: {
				type: 'bar',
				height: 330,
				foreColor: '#9aa0ac',
				stacked: true,
				toolbar: {
					show: false,
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						legend: {
							position: 'bottom',
							offsetX: -10,
							offsetY: 0,
						},
					},
				},
			],
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: '20%',
				},
			},
			dataLabels: {
				enabled: false,
			},
			xaxis: {
				type: 'category',
				categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
			},
			legend: {
				show: false,
			},
			fill: {
				opacity: 1,
				colors: ['#25B9C1', '#4B4BCB', '#EA9022', '#9E9E9E'],
			},
		};
	}

	private chart3() {
		this.pieChartOptions = {
			series: [44, 55, 13, 43, 22],
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
			labels: ['Science', 'Mathes', 'Economics', 'History', 'Music'],
			responsive: [
				{
					breakpoint: 480,
					options: {},
				},
			],
		};
	}
}
