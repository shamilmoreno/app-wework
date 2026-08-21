import { Injectable } from '@angular/core';
import { environment } from '../../..//environments/environment';
import { MyValidators } from '@core/helpers/my-validators';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import "jspdf-autotable";
import moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class PdfExportService {
	public imagePathTatmak = `${environment.server}/resources/fondo-reporte-vertical.png`;
	public imagePathHoTatmak = `${environment.server}/resources/fondo-reporte-hotizontal.png`;
	public imagePathWework = `${environment.server}/resources/fondo-reporte-vertical.png`;
	public imagePathHWework = `${environment.server}/resources/fondo-reporte-hotizontal.png`;
	public columns = ["ITEM", "DESCRIPCIÓN", "CANTIDAD", "TOTAL"];
	public data = [];
	public type = '';
	public styles = null;

	constructor() { }

	public exportToPdfRecipeResume(info: any) {
		console.log('Información para el PDF:', info);

		// 1. Configuración inicial del documento
		const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'letter' });
		const imgData = this.imagePathTatmak;
		const width = doc.internal.pageSize.getWidth();
		const height = doc.internal.pageSize.getHeight();
		const marginBottom = 20; // Margen inferior para el pie de página
		const pageMargin = 15; // Margen lateral

		// 2. Funciones de formato seguras
		const safeFormatCurrency = (value: any): string => {
			try {
				if (value === null || value === undefined || isNaN(value)) return '$0.00';
				const numericValue = typeof value === 'string' ? parseFloat(value) : Number(value);
				return numericValue.toLocaleString('es-MX', {
					style: 'currency',
					currency: 'MXN',
					minimumFractionDigits: 2,
					maximumFractionDigits: 2
				});
			} catch (error) {
				console.error('Error al formatear moneda:', value, error);
				return '$0.00';
			}
		};

		const safeNumberFormat = (value: any): string => {
			try {
				if (value === null || value === undefined || isNaN(value)) return '0';
				return MyValidators.numberFormat(value);
			} catch (error) {
				console.error('Error al formatear número:', value, error);
				return '0';
			}
		};

		// 3. Estilos estandarizados
		const styles = {
			title: {
				fontSize: 16,
				font: 'helvetica',
				style: 'bold' as const,
				align: "center" as const,
				color: "#222a40",
				spacingAfter: 8
			},
			subtitle: {
				fontSize: 12,
				font: 'helvetica',
				style: 'normal' as const,
				align: "center" as const,
				color: "#666666",
				spacingAfter: 12
			},
			sectionHeader: {
				fontSize: 14,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#222a40",
				spacingAfter: 6
			},
			subsectionHeader: {
				fontSize: 12,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#222a40",
				spacingAfter: 4
			},
			tableHeader: {
				fontSize: 10,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#ffffff",
				fillColor: [34, 42, 64]
			},
			bodyBold: {
				fontSize: 10,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#222a40"
			},
			body: {
				fontSize: 10,
				font: 'helvetica',
				style: 'normal' as const,
				color: "#000000",
				cellPadding: 3
			},
			footer: {
				fontSize: 8,
				font: 'helvetica',
				style: 'normal' as const,
				color: "#666666"
			},
			highlight: {
				fontSize: 10,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#1a5276"
			},
			total: {
				fontSize: 11,
				font: 'helvetica',
				style: 'bold' as const,
				color: "#222a40"
			}
		};

		// 4. Funciones auxiliares
		const applyStyle = (doc: jsPDF, style: any) => {
			doc.setFont(style.font || 'helvetica', style.style || 'normal');
			doc.setFontSize(style.fontSize);
			doc.setTextColor(style.color);
		};

		const addBackground = (doc: jsPDF) => {
			doc.addImage(imgData, 'JPEG', 0, 0, width, height, undefined, 'FAST');
			doc.setFillColor(255, 255, 255);
			(doc as any).setGState(new (doc as any).GState({ opacity: 0.7 }));
			doc.rect(0, 0, width, height, 'F');
			(doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
		};

		const addTitle = (doc: jsPDF, title: string, subtitle: string, y: number) => {
			applyStyle(doc, styles.title);
			doc.text(title, width / 2, y, { align: styles.title.align });
			applyStyle(doc, styles.subtitle);
			doc.text(subtitle, width / 2, y + styles.title.spacingAfter, { align: styles.subtitle.align });
			return y + styles.title.spacingAfter + styles.subtitle.spacingAfter;
		};

		const addHorizontalLine = (doc: jsPDF, y: number) => {
			doc.setDrawColor(200, 200, 200);
			doc.setLineWidth(0.5);
			doc.line(pageMargin, y, width - pageMargin, y);
			return y + 8;
		};

		const addSectionHeader = (doc: jsPDF, text: string, y: number) => {
			applyStyle(doc, styles.sectionHeader);
			doc.text(text, pageMargin, y);
			doc.setDrawColor(34, 42, 64);
			doc.setLineWidth(0.8);
			doc.line(pageMargin, y + 2, 50, y + 2);
			return y + styles.sectionHeader.spacingAfter;
		};

		const addSubsectionHeader = (doc: jsPDF, text: string, y: number) => {
			applyStyle(doc, styles.subsectionHeader);
			doc.text(text, pageMargin, y);
			return y + styles.subsectionHeader.spacingAfter;
		};

		// 5. Función para tablas con resumen individual
		const addTableWithSummary = (
			doc: jsPDF,
			title: string,
			data: any[],
			startY: number,
			summaryText: string
		): number => {
			let currentY = startY;

			// Añadir título
			applyStyle(doc, styles.subsectionHeader);
			doc.text(title, pageMargin, currentY);
			currentY += 5;

			// Preparar datos de la tabla
			const tableData = data.map((item: any) => [
				item?.name || 'Sin nombre',
				`${safeNumberFormat(item?.quantity)} Und`,
				safeFormatCurrency(item?.price)
			]);

			// Añadir tabla
			(doc as any).autoTable({
				head: [['Producto', 'Cantidad', 'Precio']],
				body: tableData,
				startY: currentY,
				margin: { left: pageMargin, right: pageMargin },
				headStyles: styles.tableHeader,
				bodyStyles: styles.body,
				alternateRowStyles: { fillColor: [245, 245, 245] },
				tableWidth: 'auto',
				didDrawPage: (data: any) => {
					if (data.pageCount === data.pageNumber) {
						addFooter(doc);
					}
				}
			});

			currentY = (doc as any).lastAutoTable.finalY + 5;

			// Verificar espacio para el resumen
			const textHeight = doc.getTextDimensions(summaryText).h;
			if (currentY + textHeight + 5 > height - marginBottom) {
				doc.addPage();
				addBackground(doc);
				currentY = 20;
			}

			// Añadir resumen
			applyStyle(doc, styles.highlight);
			doc.text(summaryText, pageMargin, currentY);

			return currentY + textHeight + 10;
		};

		// 6. Pie de página
		const addFooter = (doc: jsPDF) => {
			const pageCount = doc.getNumberOfPages();
			for (let i = 1; i <= pageCount; i++) {
				doc.setPage(i);
				const currentHeight = (doc as any).lastAutoTable?.finalY || height - marginBottom - 10;
				const footerY = Math.max(currentHeight + 5, height - 10);

				applyStyle(doc, styles.footer);
				doc.text(`Página ${i} de ${pageCount}`, width - pageMargin, footerY, { align: "right" });
				doc.text(`Generado el ${moment().format('DD/MM/YYYY HH:mm')}`, pageMargin, footerY);
			}
		};

		// --- PRIMERA PÁGINA COMPLETA ---
		addBackground(doc);
		let currentY = addTitle(doc, "INFORME RECETA", info.perBag?.maquiladorBag?.name || 'Sin nombre', 20);
		currentY = addHorizontalLine(doc, currentY);

		// 1. Datos generales
		const renderGeneralData = (doc: jsPDF, y: number): number => {
			const leftCol = pageMargin;
			const rightCol = 110;
			const lineHeight = 6;
			let currentY = y;

			applyStyle(doc, styles.bodyBold);
			doc.text('DATOS GENERALES', leftCol, currentY);
			currentY += lineHeight;

			// Columnas izquierda
			applyStyle(doc, styles.body);
			doc.text('Mes receta:', leftCol, currentY);
			doc.text('Cantidad de bolsas:', leftCol, currentY + lineHeight);
			doc.text('Flete total:', leftCol, currentY + lineHeight * 2);

			// Columnas derecha
			doc.text('Monto facturación:', rightCol, currentY);
			doc.text('Comisión:', rightCol, currentY + lineHeight);
			doc.text('Facturación - Comisión:', rightCol, currentY + lineHeight * 2);


			// Valores
			const leftValueX = leftCol + 40;
			const rightValueX = rightCol + 45;

			moment.locale('es');
			// Valores Izquierda
			doc.text(info.perBag?.monthRecipe ? moment(info.perBag.monthRecipe).format('MMMM YYYY').toUpperCase() : 'N/A', leftValueX, currentY);
			doc.text(info.totals?.totalNumberBags ? `${safeNumberFormat(info.totals.totalNumberBags)} Bolsas` : '0 Bolsas', leftValueX, currentY + lineHeight);
			doc.text(safeFormatCurrency(info.totals?.totalFreightForProduct), leftValueX, currentY + lineHeight * 2);

			// Valores Derecha
			doc.text(safeFormatCurrency(info.totals?.billingAmount), rightValueX, currentY);
			doc.text(safeFormatCurrency(info.totals?.totalCommission), rightValueX, currentY + lineHeight);
			doc.text(safeFormatCurrency(info.totals?.billingAmountLessCommission), rightValueX, currentY + lineHeight * 2);

			return currentY + lineHeight * 4 + 10;
		};

		currentY = renderGeneralData(doc, currentY);

		// 2. Tabla de productos principal
		const tableData = (info.products || [])
			.filter((product: any) => product?.productQuantity > 0)
			.map((product: any) => [
				product?.product?.name || 'Sin nombre',
				`${safeNumberFormat(product?.productQuantity)} Und`,
				`${safeNumberFormat(product?.quantityProductRequired)} Und`,
				safeFormatCurrency(product?.priceProduct),
				safeFormatCurrency(product?.priceSale),
			]);

		(doc as any).autoTable({
			head: [['Producto', 'Cant', 'Req', 'P. Unit.', 'P. Venta']],
			body: tableData,
			startY: currentY,
			margin: { left: pageMargin, right: pageMargin },
			headStyles: styles.tableHeader,
			bodyStyles: styles.body,
			alternateRowStyles: { fillColor: [245, 245, 245] },
			didDrawPage: (data: any) => {
				if (data.pageCount === data.pageNumber) {
					addFooter(doc);
				}
			}
		});

		currentY = (doc as any).lastAutoTable.finalY + 10;

		// 3. RESUMEN COMPLETO DE PRIMERA PÁGINA
		const firstPageSummary = () => {
			let summaryY = currentY;

			// Línea divisoria
			doc.setDrawColor(200, 200, 200);
			doc.line(pageMargin, summaryY, width - pageMargin, summaryY);
			summaryY += 10;

			// Resumen de productos por bolsa
			applyStyle(doc, styles.bodyBold);
			doc.text(`${safeNumberFormat(info.perBag?.productForBag)} Productos por Bolsa:`, pageMargin, summaryY);
			applyStyle(doc, styles.body);
			doc.text(`${safeNumberFormat(info.totals?.totalProductsBag)} Und`, 75, summaryY);
			doc.text(`${safeFormatCurrency(info.perBag?.unitCostPrice)} Costo`, 120, summaryY);
			doc.text(`${safeFormatCurrency(info.perBag?.unitSalesPrice)} Venta`, 165, summaryY);
			summaryY += 10;

			// Texto descriptivo completo (COMENTADO)
			/*
			const summaryText = `Para esta receta del Maquilador "${info.perBag?.maquiladorBag?.name?.toUpperCase() || 'SIN NOMBRE'}", tenemos:
			- Total bolsas: ${safeNumberFormat(info.totals?.totalNumberBags)}
			- Costo total: ${safeFormatCurrency(info.totals?.totalCostPrice)}
			- Venta total: ${safeFormatCurrency(info.totals?.totalSalePrice)}
			- Costo combo + operativo: ${safeFormatCurrency(info.perBag?.comboCost)}
			- Utilidad neta: ${safeFormatCurrency(info.perBag?.comboUtility)}`;
		
			const textLines = doc.splitTextToSize(summaryText, width - 30);
			doc.text(textLines, pageMargin, summaryY);
			return summaryY + (textLines.length * 6) + 10;
			*/

			// Retorno sin el texto descriptivo
			return summaryY;
		};

		currentY = firstPageSummary();

		// --- SEGUNDA PÁGINA: REPORTE DE COSTOS ---
		doc.addPage();
		addBackground(doc);
		currentY = addTitle(doc, "INFORME RECETA", "Reporte de Costos y Precios", 20);
		currentY = addHorizontalLine(doc, currentY);

		// Función para reporte de costos
		const generateCostReport = (doc: jsPDF, info: any, startY: number): number => {
			const col1 = pageMargin;
			const col2 = 90;
			const col3 = 170;
			const lineHeight = 6;
			const sectionSpacing = 15;
			let currentY = startY;

			currentY = addSectionHeader(doc, 'REPORTE DE COSTOS Y PRECIOS', currentY);
			currentY += 10;

			/* applyStyle(doc, styles.body);
			doc.text(`Mes de producción: ${info.perBag?.monthRecipe ? moment(info.perBag.monthRecipe).format('MMMM YYYY').toUpperCase() : 'N/A'}`, pageMargin, currentY);
			doc.text(`Total bolsas producidas: ${safeNumberFormat(info.totals?.totalNumberBags)}`, pageMargin, currentY + lineHeight);
			currentY += lineHeight * 2; */

			// Sección I: Costos unitarios
			currentY = addSubsectionHeader(doc, 'I. DETALLE DE PRECIO DE COSTO POR BOLSA', currentY);

			applyStyle(doc, styles.tableHeader);
			doc.text('CONCEPTO', col1, currentY);
			doc.text('DESCRIPCIÓN', col2, currentY);
			doc.text('MONTO ($)', col3, currentY);

			const costs = {
				productos: info.perBag?.unitCostPrice || 0,
				maquila: parseFloat(info.perBag?.maquila) || 0,
				operativos: parseFloat(info.perBag?.operatingExpense) || 0
			};

			currentY += lineHeight;
			applyStyle(doc, styles.body);
			doc.text('A. Monto Total a Costo', col1, currentY);
			doc.text('Productos integran la bolsa mas empaque', col2, currentY);
			doc.text(safeFormatCurrency(costs.productos), col3, currentY);

			currentY += lineHeight;
			doc.text('B. Maquila', col1, currentY);
			doc.text('Mano de obra para armado de bolsa', col2, currentY);
			doc.text(safeFormatCurrency(costs.maquila), col3, currentY);

			currentY += lineHeight;
			doc.text('C. Gastos Operativos', col1, currentY);
			doc.text('Logística, transporte y gastos indirectos', col2, currentY);
			doc.text(safeFormatCurrency(costs.operativos), col3, currentY);

			const unitCost = Object.values(costs).reduce((a, b) => a + b, 0);
			currentY += lineHeight + 2;
			applyStyle(doc, styles.total);
			doc.text('TOTAL PRECIO COSTO INTEGRADO', col1, currentY);
			doc.text('A + B + C', col2, currentY);
			doc.text(safeFormatCurrency(unitCost), col3, currentY);

			// Sección II: Precio de venta
			currentY += sectionSpacing;
			currentY = addSubsectionHeader(doc, 'II. DETALLE DE PRECIO DE VENTA POR BOLSA', currentY);

			applyStyle(doc, styles.tableHeader);
			doc.text('CONCEPTO', col1, currentY);
			doc.text('DESCRIPCIÓN', col2, currentY);
			doc.text('MONTO ($)', col3, currentY);

			const unitSale = info.perBag?.unitSalesPrice || 0;
			const taxAmount = parseFloat(info.perBag?.tax) || 0;
			const commissionAmount = parseFloat(info.perBag?.commission) || 0;
			const taxRate = unitSale ? Math.round((taxAmount / unitSale) * 100 * 100) / 100 : 0;
			const commissionRate = unitSale ? Math.round((commissionAmount / unitSale) * 100 * 100) / 100 : 0;
			const finalPrice = unitSale + taxAmount + commissionAmount;

			currentY += lineHeight;
			applyStyle(doc, styles.body);
			doc.text('A. Monto Total a Venta', col1, currentY);
			doc.text('Productos integran la bolsa mas empaque', col2, currentY);
			doc.text(safeFormatCurrency(unitSale), col3, currentY);

			currentY += lineHeight;
			doc.text(`B. Impuesto (${taxRate}%)`, col1, currentY);
			doc.text('Impuesto Unitario (%) por Bolsa', col2, currentY);
			doc.text(safeFormatCurrency(taxAmount), col3, currentY);

			currentY += lineHeight;
			doc.text(`C. Comisión (${commissionRate}%)`, col1, currentY);
			doc.text('Comisión Unitaria (%) por Bolsa', col2, currentY);
			doc.text(safeFormatCurrency(commissionAmount), col3, currentY);

			currentY += lineHeight + 2;
			applyStyle(doc, styles.total);
			doc.text('TOTAL PRECIO FINAL DE VENTA', col1, currentY);
			doc.text('A + B + C', col2, currentY);
			doc.text(safeFormatCurrency(finalPrice), col3, currentY);

			currentY += sectionSpacing;
			const text = `UTILIDAD NETA POR BOLSA: ${safeFormatCurrency(finalPrice - unitCost)}`;
			const textWidth = doc.getTextWidth(text);
			const x = (width - textWidth) / 2;

			applyStyle(doc, styles.highlight);
			doc.text(text, x, currentY);

			return currentY;
		};

		currentY = generateCostReport(doc, info, currentY);

		// --- TERCERA PÁGINA: COLABORADORES ---
		doc.addPage();
		addBackground(doc);
		currentY = addTitle(doc, "INFORME RECETA", 'Información de colaboradores', 20);
		currentY = addHorizontalLine(doc, currentY);

		// Datos de colaboradores
		const renderCollaboratorsData = (doc: jsPDF, y: number): number => {
			let currentY = y;

			applyStyle(doc, styles.subsectionHeader);
			doc.text('INFORMACIÓN DE COLABORADORES', pageMargin, currentY);
			currentY += 10;

			// Datos resumidos
			applyStyle(doc, styles.bodyBold);
			doc.text(`Colaborador: ${info.perBag?.maquiladorBag?.name || 'N/A'}`, pageMargin, currentY);
			doc.text(`Productos: ${safeNumberFormat(info.totals?.amountMaquilador)} Und`, pageMargin, currentY + 5);
			doc.text(`Monto: ${safeFormatCurrency(info.totals?.amountDollarsMaquilador)}`, pageMargin, currentY + 10);

			doc.text('Grupo Tatmak', width / 2 + 5, currentY);
			doc.text(`Productos: ${safeNumberFormat(info.totals?.amountPaciscor)} Und`, width / 2 + 5, currentY + 5);
			doc.text(`Monto: ${safeFormatCurrency(info.totals?.amountDollarsPaciscor)}`, width / 2 + 5, currentY + 10);

			currentY += 20;

			// Tabla del colaborador principal con resumen
			const maquiladorData = info.totals?.infoProductMaquilador || [];
			const maquiladorSummary = `RESUMEN ${info.perBag?.maquiladorBag?.name?.toUpperCase() || 'COLABORADOR'}: ${safeNumberFormat(maquiladorData.reduce((sum: any, item: any) => sum + (item?.quantity || 0), 0))} productos (${safeFormatCurrency(maquiladorData.reduce((sum: any, item: any) => sum + (item?.price || 0), 0))})`;

			currentY = addTableWithSummary(
				doc,
				`PRODUCTOS ${info.perBag?.maquiladorBag?.name?.toUpperCase() || 'COLABORADOR'}`,
				maquiladorData,
				currentY,
				maquiladorSummary
			);

			// Tabla de Grupo Tatmak con resumen
			const paciscorData = info.totals?.infoProductPaciscor || [];
			const paciscorSummary = `RESUMEN GRUPO TATMAK: ${safeNumberFormat(paciscorData.reduce((sum: any, item: any) => sum + (item?.quantity || 0), 0))} productos (${safeFormatCurrency(paciscorData.reduce((sum: any, item: any) => sum + (item?.price || 0), 0))})`;

			currentY = addTableWithSummary(
				doc,
				'PRODUCTOS GRUPO TATMAK',
				paciscorData,
				currentY,
				paciscorSummary
			);

			// Resumen general si hay espacio
			if (currentY < height - marginBottom - 20) {
				applyStyle(doc, styles.total);
				const generalSummary = `RESUMEN GENERAL: ${info.perBag?.maquiladorBag?.name || 'Colaborador'} aportó ${safeNumberFormat(info.totals?.amountMaquilador)} productos (${safeFormatCurrency(info.totals?.amountDollarsMaquilador)}) | Grupo Tatmak aportó ${safeNumberFormat(info.totals?.amountPaciscor)} productos (${safeFormatCurrency(info.totals?.amountDollarsPaciscor)})`;
				const lines = doc.splitTextToSize(generalSummary, width - 30);
				doc.text(lines, pageMargin, currentY);
				currentY += lines.length * 6 + 10;
			}

			return currentY;
		};

		currentY = renderCollaboratorsData(doc, currentY);

		// --- CUARTA PÁGINA: PAGOS ---
		doc.addPage();
		addBackground(doc);
		currentY = addTitle(doc, "INFORME RECETA", 'Información de pagos', 20);
		currentY = addHorizontalLine(doc, currentY);

		// Tabla de pagos
		applyStyle(doc, styles.subsectionHeader);
		doc.text('HISTORIAL DE PAGOS', pageMargin, currentY);
		currentY += 10;

		// Encabezados de tabla
		applyStyle(doc, styles.tableHeader);
		doc.text('FECHA', pageMargin, currentY);
		doc.text('PAGADOR', 50, currentY);
		doc.text('MONTO', 90, currentY);
		doc.text('COMPROBANTE', 120, currentY);
		doc.text('FORMA DE PAGO', 165, currentY);

		// Datos de pagos
		applyStyle(doc, styles.body);
		let totalPay = 0;
		(info.payments || []).forEach((p: any, i: number) => {
			const y = currentY + 5 + i * 5;
			doc.text(p?.paymentDate ? moment(p.paymentDate).format('l') : 'N/A', pageMargin, y);
			doc.text(p?.name || 'N/A', 50, y);
			doc.text(safeFormatCurrency(p?.amount), 90, y);
			doc.text(p?.referenceNumber || 'N/A', 120, y);
			doc.text(p?.paymentMethod || 'N/A', 165, y);
			totalPay += Number(p?.amount) || 0;
		});

		const paymentsEndY = currentY + 5 + (info.payments?.length || 0) * 5;
		doc.text('-------------------------------------------------------------------------------------------------------------------------------------------------------', pageMargin, paymentsEndY);
		applyStyle(doc, styles.total);
		doc.text(`Monto total Abonado para la fecha: ${safeFormatCurrency(totalPay)}`, pageMargin, paymentsEndY + 5);

		// Asegurar que el footer se añada
		addFooter(doc);

		// Generar PDF
		doc.output('dataurlnewwindow', {
			filename: `Informe_Receta_${info.perBag?.maquiladorBag?.name || 'Receta'}_${moment().format('YYYYMMDD')}.pdf`
		});
	}

	private formatCurrency(value: number): string {
		return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}

	public exportToPdfRecipeResumePruebas(info: any) {
		// Configuración con tipos correctos
		const config = {
			document: {
				orientation: 'p' as 'p' | 'portrait' | 'l' | 'landscape',
				unit: 'mm' as 'mm' | 'pt' | 'px' | 'in' | 'cm' | 'ex' | 'em' | 'pc',
				format: 'letter',
				compress: true
			},
			styles: {
				colors: {
					primary: '#1a237e',
					secondary: '#303f9f',
					text: '#424242',
					accent: '#3f51b5'
				},
				fonts: {
					header: 18,
					title: 14,
					subtitle: 12,
					normal: 10
				},
				margins: {
					top: 40,
					bottom: 20,
					left: 10,
					right: 10
				}
			}
		};

		const doc = new jsPDF({
			orientation: config.document.orientation,
			unit: config.document.unit,
			format: config.document.format,
			compress: config.document.compress
		});

		const { width, height } = doc.internal.pageSize;
		let currentY = config.styles.margins.top;

		// Helpers
		const formatCurrency = (value: number): string =>
			value.toLocaleString('es-ES', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

		const formatNumber = (value: number): string =>
			value.toLocaleString('es-ES', { maximumFractionDigits: 0 });

		// Control de paginación
		const checkPageBreak = (requiredSpace: number): boolean => {
			if (currentY + requiredSpace > height - config.styles.margins.bottom) {
				doc.addPage();
				createPageHeader();
				currentY = config.styles.margins.top;
				return true;
			}
			return false;
		};

		// Crear encabezado con numeración de página corregida
		const createPageHeader = (): void => {
			// Fondo del encabezado
			doc.setFillColor(config.styles.colors.primary);
			doc.rect(0, 0, width, 35, 'F');

			// Logo
			doc.addImage(this.imagePathTatmak, 'JPEG', 10, 5, 25, 25, undefined, 'FAST');

			// Títulos
			doc.setTextColor('#FFFFFF');
			doc.setFontSize(config.styles.fonts.header);
			doc.text("INFORME DE RECETA", width / 2, 15, { align: 'center' });

			doc.setFontSize(config.styles.fonts.subtitle);
			doc.text(info.perBag.maquiladorBag.name.toUpperCase(), width / 2, 25, { align: 'center' });

			// Línea decorativa
			doc.setDrawColor(config.styles.colors.accent);
			doc.setLineWidth(0.5);
			doc.line(10, 35, width - 10, 35);

			// Número de página
			doc.setFontSize(8);
			doc.setTextColor('#000000');
			const pageNumber = doc.internal.pages.length - 1;
			doc.text(`Página ${pageNumber}`, width - 20, height - 10);
		};

		// Crear sección de información general
		const createInfoSection = (): void => {
			const infoBoxes = [
				{ title: "MES RECETA", value: moment(info.perBag.monthRecipe).format('MMMM YYYY').toUpperCase() },
				{ title: "TOTAL BOLSAS", value: formatNumber(info.totals.totalNumberBags) },
				{ title: "FACTURACIÓN", value: formatCurrency(info.totals.billingAmount) },
				{ title: "PRECIO COSTO", value: formatCurrency(info.perBag.unitCostPrice) },
				{ title: "PRECIO VENTA", value: formatCurrency(info.perBag.unitSalesPrice) },
				{ title: "UTILIDAD", value: formatCurrency(info.perBag.comboUtility) }
			];

			const boxWidth = (width - 40) / 3;
			const boxHeight = 25;
			let localY = currentY;

			infoBoxes.forEach((box, index) => {
				const row = Math.floor(index / 3);
				const col = index % 3;
				const x = config.styles.margins.left + (col * (boxWidth + 5));
				const y = localY + (row * (boxHeight + 5));

				// Caja de información
				doc.setFillColor(245, 245, 245);
				doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'F');

				// Título
				doc.setFontSize(config.styles.fonts.normal);
				doc.setTextColor(config.styles.colors.secondary);
				doc.text(box.title, x + 5, y + 7);

				// Valor
				doc.setFontSize(config.styles.fonts.title);
				doc.setTextColor(config.styles.colors.text);
				doc.text(box.value, x + 5, y + 18);
			});

			currentY = localY + 60;
		};

		// Crear tabla de productos
		const createProductsTable = (): void => {
			const tableData = info.products
				.filter((product: any) => product.productQuantity > 0)
				.map((product: any) => [
					product.product.name,
					formatNumber(product.productQuantity) + " Und",
					formatNumber(product.quantityProductRequired) + " Und",
					formatCurrency(product.priceProduct),
					formatCurrency(product.priceSale)
				]);

			autoTable(doc, {
				head: [[
					{ content: 'PRODUCTO', styles: { fillColor: [26, 35, 126] } },
					{ content: 'CANTIDAD', styles: { fillColor: [26, 35, 126] } },
					{ content: 'REQUERIDO', styles: { fillColor: [26, 35, 126] } },
					{ content: 'P.UNITARIO', styles: { fillColor: [26, 35, 126] } },
					{ content: 'P.VENTA', styles: { fillColor: [26, 35, 126] } }
				]],
				body: tableData,
				startY: currentY,
				theme: 'grid',
				styles: {
					fontSize: 9,
					cellPadding: 5,
					lineColor: [224, 224, 224],
					lineWidth: 0.5,
					overflow: 'linebreak'
				},
				headStyles: {
					textColor: '#FFFFFF',
					fontSize: 10,
					fontStyle: 'bold'
				},
				columnStyles: {
					0: { cellWidth: 60 },
					1: { cellWidth: 30, halign: 'right' },
					2: { cellWidth: 30, halign: 'right' },
					3: { cellWidth: 35, halign: 'right' },
					4: { cellWidth: 35, halign: 'right' }
				},
				didDrawPage: (data: any) => {
					createPageHeader();
				},
				willDrawCell: (data: any) => {
					if (data.cell.text.length > 0) {
						const textHeight = doc.getTextDimensions(data.cell.text).h;
						if (data.cell.height < textHeight) {
							data.cell.height = textHeight + 4;
						}
					}
				}
			});

			currentY = (doc as any).lastAutoTable.finalY + 10;
		};

		// Crear sección de colaboradores
		const createCollaboratorsSection = (): void => {
			checkPageBreak(150);

			doc.setFontSize(config.styles.fonts.title);
			doc.setTextColor(config.styles.colors.primary);
			doc.text("INFORMACIÓN DE COLABORADORES", config.styles.margins.left, currentY);
			currentY += 10;

			const expenses = [
				{ label: "Gasto Operativo", value: formatCurrency(info.perBag.operatingExpense) },
				{ label: "Maquila", value: formatCurrency(info.perBag.maquila) },
				{ label: "Impuesto", value: formatCurrency(info.perBag.tax) },
				{ label: "Comisión", value: formatCurrency(info.perBag.commission) }
			];

			expenses.forEach(item => {
				checkPageBreak(8);
				doc.setFontSize(config.styles.fonts.normal);
				doc.text(`${item.label}: ${item.value}`, config.styles.margins.left, currentY);
				currentY += 8;
			});
		};

		// Crear sección de pagos
		const createPaymentsSection = (): void => {
			checkPageBreak(100);

			doc.setFontSize(config.styles.fonts.title);
			doc.setTextColor(config.styles.colors.primary);
			doc.text("REGISTRO DE PAGOS", config.styles.margins.left, currentY);
			currentY += 10;

			const paymentsData = info.payments.map((p: any) => [
				moment(p.paymentDate).format('L'),
				p.name,
				formatCurrency(p.amount),
				p.referenceNumber,
				p.paymentMethod
			]);

			autoTable(doc, {
				head: [['Fecha', 'Pagador', 'Monto', 'Comprobante', 'Forma de Pago']],
				body: paymentsData,
				startY: currentY,
				theme: 'grid',
				styles: {
					fontSize: 9,
					overflow: 'linebreak'
				},
				didDrawPage: () => createPageHeader()
			});
		};

		// Generar el documento
		createPageHeader();
		createInfoSection();
		createProductsTable();
		createCollaboratorsSection();
		createPaymentsSection();

		// Generar PDF
		const fileName = `Receta_${info.perBag.maquiladorBag.name}_${moment(info.perBag.monthRecipe).format('YYYY_MM')
			}.pdf`;

		doc.output('dataurlnewwindow', { filename: fileName });
	}

	public exportToPdfRecipe(info: any) {
		/* 		console.log('Esta es la informacion de la receta', info);
		 */
		/* const doc: any = new jsPDF('landscape'); */
		let doc: any = new jsPDF({ orientation: 'l', unit: 'mm', format: 'letter' }); // Formato carta, orientación horizontal

		let imgData = this.imagePathHoTatmak;
		let width = doc.internal.pageSize.getWidth();
		let height = doc.internal.pageSize.getHeight();
		doc.addImage(imgData, 'JPEG', 0, 0, width, height, undefined, 'FAST');

		// Ajustar la posición del título y otros elementos
		const titleY = 20; // Subido más
		const subtitleY = titleY + 8; // Espacio entre título y subtítulo
		const lineY = subtitleY + 8; // Espacio entre subtítulo y línea horizontal
		const dataStartY = lineY + 8; // Espacio entre línea horizontal y datos generales

		console.log('Esta es la direccion de la imagen de fondo horizontal', this.imagePathHoTatmak)

		// Añadir título al PDF
		doc.setFontSize(22);
		doc.text("INFORME RECETA", doc.internal.pageSize.getWidth() / 2, titleY, { align: "center" });

		// Añadir subtítulo
		doc.setFontSize(16);
		doc.text(info.maquiladorBag, doc.internal.pageSize.getWidth() / 2, subtitleY, { align: "center" });

		// Añadir una línea horizontal
		doc.setLineWidth(0.5);
		doc.line(10, lineY, 280, lineY);

		// Datos generales
		doc.setFontSize(10);
		doc.setTextColor("#000000");
		doc.text('MES RECETA:', 10, dataStartY);
		doc.text('CANTIDAD DE BOLSAS:', 10, dataStartY + 5);
		doc.text('PRECIO COSTO BOLSA:', 120, dataStartY);
		doc.text('PRECIO VENTA BOLSA:', 120, dataStartY + 5);

		doc.text(info.monthRecipeBag, 52, dataStartY);
		doc.text(info.numberBags, 52, dataStartY + 5);
		doc.text(info.valueAtSalesPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 170, dataStartY);
		doc.text(info.valueToPriceCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 170, dataStartY + 5);

		// Datos de los productos
		/* 	const tableData = info.products.map((product: any) => [
				product.product.name,
				MyValidators.numberFormat(product.productQuantity) + " Und",
				MyValidators.numberFormat(product.quantityProductRequired) + " Und",
				parseFloat(product.priceProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.priceSale).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.amountFreightForProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.totalFreightForProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
			]); */

		const tableData = info.products
			.filter((product: any) => product.productQuantity > 0)
			.map((product: any) => [
				product.product.name,
				MyValidators.numberFormat(product.productQuantity) + " Und",
				MyValidators.numberFormat(product.quantityProductRequired) + " Und",
				parseFloat(product.priceProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.priceSale).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.amountFreightForProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
				parseFloat(product.totalFreightForProduct).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
			]);


		autoTable(doc, {
			head: [['Producto', 'Cant', 'Req', 'P. Unit.', 'P. Venta', 'Flete Unit.', 'Total Flete']], // Títulos abreviados
			body: tableData,
			startY: dataStartY + 10, // Ajustado para subir la tabla
			theme: 'striped',
			headStyles: { fillColor: [0, 0, 0] }, // Cambiar el color del encabezado a #2ea3f2
			bodyStyles: { fillColor: [245, 245, 245] },
			styles: { fontSize: 10 }
		});

		// Añadir texto de conclusión y pie de página
		const finalY = (doc as any).lastAutoTable.finalY + 10;
		doc.text("Este es el final del informe de la receta.", doc.internal.pageSize.getWidth() / 2, finalY, { align: "center" });

		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
		}

		// Mostrar el PDF en una nueva ventana
		doc.output('dataurlnewwindow', { filename: 'informe_receta.pdf' });

		// Guardar el PDF con un nombre específico
		// doc.save("informe_receta.pdf");
	}

	public exportToExcelRecipe(info: any) {
		// Crear una hoja de cálculo con los datos generales
		const wsData = [
			['INFORME RECETA'],
			[info.maquiladorBag],
			[],
			['MES RECETA:', info.monthRecipeBag],
			['CANTIDAD DE BOLSAS:', info.numberBags],
			['PRECIO COSTO BOLSA:', info.valueToPriceCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
			['PRECIO VENTA BOLSA:', info.valueAtSalesPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })],
			[],
			['Producto', 'Cantidad', 'Cantidad Requerida', 'Precio Unitario', 'Total Precio Unitario', 'Precio Venta', 'Total Precio Venta',
				'Produccion Maquilador', 'Monto Maquilador', 'Produccion Paciscor', 'Monto Paciscor', 'Flete Unitario', 'Total Flete']
		];

		// Añadir los datos de los productos
		const productData = info.products.map((product: any) => [
			product.product.name,
			MyValidators.numberFormat(product.productQuantity) + " Und",
			MyValidators.numberFormat(product.quantityProductRequired) + " Und",
			product.priceProduct.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			product.totalCostPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			product.priceSale.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			product.totalSalePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			MyValidators.numberFormat(product.amountMaquilador) + " Und",
			product.amountDollarsMaquilador.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			MyValidators.numberFormat(product.amountPaciscor) + " Und",
			product.amountDollarsPaciscor.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			product.amountFreightForProduct.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
			product.totalFreightForProduct.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
		]);
		wsData.push(...productData);

		// Crear una hoja de cálculo
		const ws = XLSX.utils.aoa_to_sheet(wsData);

		// Crear un libro de trabajo y añadir la hoja de cálculo
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Receta');

		// Exportar el libro de trabajo a un archivo Excel
		XLSX.writeFile(wb, 'informe_receta.xlsx');
	}

	public exportToPdfShipment(info: any) {
		let doc: any = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' }); // Orientación vertical, formato carta

		// Añadir imagen de fondo si es necesario
		let imgData = this.imagePathHoTatmak;
		let width = doc.internal.pageSize.getWidth();
		let height = doc.internal.pageSize.getHeight();
		doc.addImage(imgData, 'JPEG', 0, 0, width, height, undefined, 'FAST');

		// Configuración de márgenes y posiciones
		const marginX = 20;
		const dataWidth = width - marginX * 2;
		const lineSpacing = 6;

		let currentY = 20; // Posición inicial en Y para el contenido

		// Título principal
		doc.setFontSize(22);
		doc.text("INFORME DE EMBARQUE", width / 2, currentY, { align: "center" });
		currentY += 10;

		// Subtítulo (Nombre del proveedor)
		doc.setFontSize(16);
		doc.text(info.provider.businessName, width / 2, currentY, { align: "center" });
		currentY += 10;

		// Línea divisoria
		doc.setLineWidth(0.5);
		doc.line(marginX, currentY, width - marginX, currentY);
		currentY += 5;

		// Sección: Datos del proveedor
		doc.setFontSize(12);
		doc.text('Datos del Proveedor:', marginX, currentY);
		currentY += lineSpacing;
		doc.setFontSize(10);
		doc.text(`Nombre: ${info.provider.businessName}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`RIF: ${info.provider.identificationNumber}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Correo: ${info.provider.email}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Dirección: ${info.provider.address}`, marginX, currentY);
		currentY += lineSpacing + 5; // Espacio extra antes de la siguiente sección

		// Sección: Datos del embarque
		doc.setFontSize(12);
		doc.text('Datos del Embarque:', marginX, currentY);
		currentY += lineSpacing;
		doc.setFontSize(10);
		doc.text(`BL: ${info.bl}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Licencia: ${info.license}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Descripción: ${info.description.name}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Origen: ${info.origin.name}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Llegada: ${info.arrivalDate}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Estado: ${info.state.name}`, marginX, currentY);
		currentY += lineSpacing;

		// Detalles adicionales
		currentY += 5;
		doc.setFontSize(12);
		doc.text('Detalles Adicionales:', marginX, currentY);
		currentY += lineSpacing;
		doc.setFontSize(10);
		doc.text(`Unidades: ${info.containerValues}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Días de demora: ${info.daysLate}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Monto por demora: ${info.amountPayDelay}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Precio Unitario: ${parseFloat(info.unitPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Kilos: ${info.kilograms}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Puerto de Entrada: ${info.entryPort.name}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Marca: ${info.brand.name}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Días Libres: ${info.freeDays}`, marginX, currentY);
		currentY += lineSpacing;
		doc.text(`Monto a Pagar por Día: ${parseFloat(info.amountToPayDay).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`, marginX, currentY);
		currentY += lineSpacing;

		// Sección: Régimenes Legales
		currentY += 5;
		doc.setFontSize(12);
		doc.text('Régimenes Legales:', marginX, currentY);
		currentY += lineSpacing;
		info.legalRegimes.forEach((regime: any, index: number) => {
			doc.setFontSize(10);
			doc.text(`- ${regime.legalRegimes.name}`, marginX, currentY);
			currentY += lineSpacing;
		});

		// Sección: Observaciones
		currentY += 5;
		doc.setFontSize(12);
		doc.text('Observaciones:', marginX, currentY);
		currentY += lineSpacing;
		info.observations.forEach((observation: any, index: number) => {
			doc.setFontSize(10);
			doc.text(`- ${observation.description}`, marginX, currentY);
			currentY += lineSpacing;
		});

		// Nueva página para Gastos Administrativos
		doc.addPage();
		currentY = 20;
		doc.setFontSize(12);
		doc.text('Gastos Administrativos:', marginX, currentY);
		currentY += lineSpacing;
		info.administrativeExpenses.forEach((expense: any, index: number) => {
			doc.setFontSize(10);
			doc.text(`Concepto: ${expense.paymentConcept}`, marginX, currentY);
			doc.text(`Fecha: ${expense.paymentDate}`, marginX + 80, currentY);
			doc.text(`Referencia: ${expense.paymentReference}`, marginX + 140, currentY);
			doc.text(`Monto en $: ${expense.amountDollars}`, marginX + 200, currentY);
			doc.text(`Monto en Bs: ${expense.amountBolivars}`, marginX + 240, currentY);
			currentY += lineSpacing;
		});

		// Nueva página para Gastos de Nacionalización
		doc.addPage();
		currentY = 20;
		doc.setFontSize(12);
		doc.text('Gastos de Nacionalización:', marginX, currentY);
		currentY += lineSpacing;
		info.nationalizationExpenses.forEach((expense: any, index: number) => {
			doc.setFontSize(10);
			doc.text(`Concepto: ${expense.paymentConcept}`, marginX, currentY);
			doc.text(`Fecha: ${expense.paymentDate}`, marginX + 80, currentY);
			doc.text(`Referencia: ${expense.paymentReference}`, marginX + 140, currentY);
			doc.text(`Monto en $: ${expense.amountDollars}`, marginX + 200, currentY);
			doc.text(`Monto en Bs: ${expense.amountBolivars}`, marginX + 240, currentY);
			currentY += lineSpacing;
		});

		// Pie de página para numeración
		const pageCount = doc.internal.getNumberOfPages();
		for (let i = 1; i <= pageCount; i++) {
			doc.setPage(i);
			doc.setFontSize(10);
			doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
		}

		// Mostrar el PDF en una nueva ventana
		doc.output('dataurlnewwindow', { filename: 'informe_embarque.pdf' });
	}
}
