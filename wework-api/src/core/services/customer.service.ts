import { Between, DeleteResult, getManager } from 'typeorm';
import { Customer } from '../../database/entities/customer';

export class CustomerService {
	public async list(): Promise<Customer[]> {
		return await getManager().getRepository(Customer).find({
			relations: [
				'documentType',
				'customerType',
			],
			order: { id: 'DESC' },
		});
	}

	public async listAct(): Promise<Customer[]> {
		return await getManager().getRepository(Customer).find({
			relations: [
				'documentType',
				'customerType'
			],
			order: { id: 'DESC' },
		});
	}

	public async getByDateFilter(init: string, end: string): Promise<[Customer[], number]> {
		return await getManager().getRepository(Customer).findAndCount({ where: { createdAt: Between(init, end) }});
	}

	public async getOne(customerId: number): Promise<Customer> {
		return await getManager().getRepository(Customer).findOne({
			relations: [
				'documentType',
				'customerType'
			],
			where: { id: customerId },
		});
	}

	public async getOneForDataValidation(dvDocumentType: number,  dvRifNumber: number): Promise<Customer> {
		return await getManager().getRepository(Customer).findOne({
			where: {
				//documentType: dvDocumentType,
				//rifNumber: dvRifNumber,
			},
		});
	}

	public async getOneForDetail(customerId: number): Promise<Customer> {
		return await getManager().getRepository(Customer).findOne({
			relations: [
				'documentType',
				'customerType'
			],
			where: { id: customerId },
		});
	}

	public async saveChanges(customer: Customer): Promise<Customer> {
		return await getManager().getRepository(Customer).save(customer);
	}

	public async remove(customerId: number): Promise<DeleteResult> {
		return await getManager().getRepository(Customer).delete(customerId);
	}
}
