import { getConnection, getManager, UpdateResult } from 'typeorm';
import { Notification } from '../../database/entities/notification';

export class NotificationService {
	public async list(): Promise<Notification[]> {
		return await getManager().getRepository(Notification).find({
			order: { id: 'DESC' },
		});
	}

	public async listUnreads(): Promise<Notification[]> {
		return await getManager().getRepository(Notification).find({
			where: { isRead: false },
			order: { id: 'DESC' },
		});
	}

	public async markAllLikeRead(): Promise<UpdateResult> {
		return await getConnection()
			.createQueryBuilder()
			.update(Notification)
			.set({ isRead: true })
			.where('isRead = :isRead', { isRead: false })
			.execute();
	}

	/*public async getOne(notificationId: number): Promise<Notification> {
	  return await getManager().getRepository(Notification).findOne({ id: notificationId });
	}*/

	public async saveChanges(notification: Notification): Promise<Notification> {
		return await getManager().getRepository(Notification).save(notification);
	}
}
