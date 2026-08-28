import https from 'https';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function getBcvRate(): Promise<number> {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false // Ignora errores de certificado
        });

        const { data } = await axios.get('https://www.bcv.org.ve/', { httpsAgent: agent });
        const $ = cheerio.load(data);

        const rateText = $('#dolar .centrado strong').text().trim();
        if (!rateText) throw new Error('No se pudo extraer la tasa USD del HTML del BCV');

        const rate = parseFloat(rateText.replace(',', '.'));
        if (isNaN(rate)) throw new Error('La tasa extraída no es un número válido');

        console.log('Tasa del BCV:', rate);
        return rate;

    } catch (error) {
        console.error('Error al obtener la tasa del BCV:', error);
        throw error; // Re-lanzamos el error para que quien llame la función pueda manejarlo
    }
}

getBcvRate();

