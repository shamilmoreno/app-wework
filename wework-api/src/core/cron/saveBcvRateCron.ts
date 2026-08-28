// src/cron/saveBcvRateCron.ts
import cron from "node-cron";
import { ExchangeRateService } from "../../core/services/exchange-rate.service ";

async function startCronJobs() {
    const svc = new ExchangeRateService();

    // 08:00 AM every day
    //cron.schedule("15 15 * * *", async () => {
    cron.schedule("0 7 * * 1-7", async () => {
        try {
            console.log("[cron] Guardando tasa BCV - morning");
            await svc.saveCurrentBcvRate("morning");
            console.log("[cron] Tasa morning guardada");
        } catch (err) {
            console.error("[cron] Error guardando tasa morning:", err);
        }
    }, {
        timezone: "America/Caracas"
    });

    // 06:00 PM every day (18:00)
    cron.schedule("0 19 * * 1-7", async () => {
        try {
            console.log("[cron] Guardando tasa BCV - evening");
            await svc.saveCurrentBcvRate("evening");
            console.log("[cron] Tasa evening guardada");
        } catch (err) {
            console.error("[cron] Error guardando tasa evening:", err);
        }
    }, {
        timezone: "America/Caracas"
    });
}

export default startCronJobs;