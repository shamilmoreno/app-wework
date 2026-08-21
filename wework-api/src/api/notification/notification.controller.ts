import { Request, Response } from 'express';
import messages from '../../core/helpers/messages';
import { HttpResponseService } from '../../core/services/http-response.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../database/entities/notification';

export class NotificationController {
  /**
   * Cargar todas las notifícaciones de la base de datos
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlList(req: Request, res: Response): Promise<void> {
    try {
      const notificationsService = new NotificationService();
      const notifications: Notification[] = await notificationsService.list();
      HttpResponseService.response(res, 200, notifications, '');
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Cargar todas las notifícaciones de la base de datos
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlListUnreads(req: Request, res: Response): Promise<void> {
    try {
      const notificationsService = new NotificationService();
      const notifications: Notification[] = await notificationsService.listUnreads();
      const count: number = notifications.length;
      HttpResponseService.response(res, 200, count, '');
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Actualización de una notificación leida o no leida
   * @param req Solicitud
   * @param res Respuesta
   */
  /*public async ctrlMarkLikeToRead(req: Request, res: Response): Promise<void> {
    try {
      const notificationService = new NotificationService();

      // Find notification
      const notification: Notification = await notificationService.getOne(req.body.id);

      // Return data
      if (notification) {
        notification.isRead = true;
        const result = await notificationService.saveChanges(notification);
        HttpResponseService.response(res, 200, result, messages.notification.notificationUpdated);
      } else {
        HttpResponseService.response(res, 404, null, messages.notification.notificationNotFound);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }*/

  /**
   * Actualización de una notificación leida o no leida
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlMarkAllLikeToRead(req: Request, res: Response): Promise<void> {
    try {
      const notificationService = new NotificationService();
      const result = await notificationService.markAllLikeRead();
      HttpResponseService.response(res, 200, result, messages.notification.notificationAllUpdated);
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }
}
