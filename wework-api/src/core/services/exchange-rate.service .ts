import { DeleteResult, getManager } from "typeorm";
import { ExchangeRate } from "../../database/entities/exchange-rate ";
import { getBcvRate } from "../../core/helpers/bcvScraper";

export class ExchangeRateService {
	public async saveCurrentBcvRate(timeOfDay?: "morning" | "evening"): Promise<ExchangeRate> {
		const rate = await getBcvRate(); // devuelve number
		const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

		const repo = getManager().getRepository(ExchangeRate);

		if (timeOfDay) {
			const existing = await repo.findOne({ where: { date: today, time_of_day: timeOfDay } });
			if (existing) {
				// Decide: actualizar o retornar existente
				existing.usd_rate = rate;
				return repo.save(existing);
			}
			const newRate = repo.create({ date: today, usd_rate: rate, source: "BANCO CENTRAL DE VENEZUELA", time_of_day: timeOfDay });
			return repo.save(newRate);
		}

		// Si no usas time_of_day: única por fecha
		let existing = await repo.findOne({ where: { date: today } });
		if (existing) {
			existing.usd_rate = rate;
			return repo.save(existing);
		}
		const newRate = repo.create({ date: today, usd_rate: rate, source: "BCV" });
		return repo.save(newRate);
	}

	public async list(): Promise<ExchangeRate[]> {
		return await getManager().getRepository(ExchangeRate).find({
			order: { id: 'DESC' },
		});
	}

	public async getOne(exchangeRateId: number): Promise<ExchangeRate> {
		return await getManager().getRepository(ExchangeRate).findOne({
			where: { id: exchangeRateId },
		});
	}

	public async saveChanges(exchangeRate: ExchangeRate): Promise<ExchangeRate> {
		return await getManager().getRepository(ExchangeRate).save(exchangeRate);
	}

	public async remove(customerId: number): Promise<DeleteResult> {
		return await getManager().getRepository(ExchangeRate).delete(customerId);
	}
}
