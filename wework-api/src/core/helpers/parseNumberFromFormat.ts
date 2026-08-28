// format-utils.ts

/**
 * Convierte un string con formato de miles (500.000) a un número puro (500000)
 */
export const parseNumberFromFormat = (value: any): number => {
	if (value === null || value === undefined || value === "") return 0;

	// Convertimos a string y eliminamos puntos y comas
	const cleanValue = String(value).replace(/[\.,]/g, "");

	return Number(cleanValue);
};