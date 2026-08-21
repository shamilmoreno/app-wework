import { Notification } from './../../database/entities/notification';
import { getCurrentDate } from './../helpers/str-utils';
import { INotificationStructure } from './../interfaces/inotification-structure';
import { NotificationService } from './../services/notification.service';

export class NotificationMiddleware {
  private notificationService = new NotificationService();

  /**
   * Notificación cuando se solicita cambiar la contraseña
   * @module Seguridad
   */
  public createRequestToChangePassword() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '';
    notification.icon = 'fa fa-unlock-alt';
    notification.message = 'Has solicitado un cambio de contraseña a través de nuestra aplicación web';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación de contraseña actualizada
   * @module Seguridad
   */
  public createChangePassword() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/change-password';
    notification.icon = 'fa fa-unlock-alt';
    notification.message = 'Tu contraseña ha sido cambiada exitosamente';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza la información personal
   * @module DatosPersonales
   */
  public createChangePersonalData() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/personal-info';
    notification.icon = 'fa fa-user';
    notification.message = 'Tus datos personales se han actualizado exitosamente';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza la información de la empresa
   * @module DatosEmpresa
   */
  public createChangeCompanyData() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/company-data';
    notification.icon = 'fa fa-check';
    notification.message = 'Los datos de la empresa se han actualizado exitosamente';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza el logo de la empresa
   * @module DatosEmpresa
   */
  public createChangeLogo() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/company-data';
    notification.icon = 'fa fa-check';
    notification.message = 'El logo de la empresa se ha actualizado exitosamente';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza la información en Valores del Sistema
   * @module ValoresDelSistema
   */
  public createChangeSystemValues() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/system-value';
    notification.icon = 'fa fa-globe';
    notification.message = 'Has actualizado información en los valores del sistema con éxito';
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se borra un presupuesto asignado a un paciente
   * @module Presupuestos
   * @param info Información necesaria para la notificación
   */
  public createBudgetDelete(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/budget';
    notification.icon = 'fa fa-suitcase';
    notification.message = `Se ha eliminado el presupuesto ${ info.data.budgetName } asignado a ${ info.data.patient }`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se asigna un paciente al presupuesto
   * @module Presupuestos
   * @param info Información necesaria para la notificación
   */
  public createBudgetAssingPatient(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/budget';
    notification.icon = 'fa fa-suitcase';
    notification.message = `Presupuesto ${ info.data.budgetName } ha sido asignado a ${ info.data.patient }`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se paga un presupuesto
   * @module Presupuestos
   * @param info Información necesaria para la notificación
   */
  public createBudgetPay(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/budget';
    notification.icon = 'fa fa-suitcase';
    notification.message = `El paciente ${ info.data.patient } ha pagado el presupuesto ${ info.data.budgetName }`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se elimina un paciente
   * @module Pacientes
   * @param info Información necesaria para la notificación
   */
  public createemployeeDelete(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/patient';
    notification.icon = 'fa fa-user-friends';
    notification.message = `El paciente ${ info.data.patient } y su información ha sido eliminada con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se crea un diagnóstico
   * @module Consultas
   * @param info Información necesaria para la notificación
   */
  public createMedicalQueryDiagnosis(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/query';
    notification.icon = 'fa fa-book-open';
    notification.message = `Has realizado el diagnóstico del paciente ${ info.data.patient }`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se elimina una consulta
   * @module Consultas
   * @param info Información necesaria para la notificación
   */
  public createMedicalQueryDelete(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/query';
    notification.icon = 'fa fa-book-open';
    notification.message = `Has eliminado la consulta en línea del paciente ${ info.data.patient } con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se paga una consulta en línea
   * @module Consultas
   * @param info Información necesaria para la notificación
   */
  public createMedicalQueryPay(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/query';
    notification.icon = 'fa fa-book-open';
    notification.message = `El paciente ${ info.data.patient } ha pagado una nueva consulta en línea`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se cree una cita
   * @module Calendario
   * @param info Información necesaria para la notificación
   */
  public createScheduleNew(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/schedule';
    notification.icon = 'fa fa-calendar-alt';
    notification.message = `Has creado una nueva cita para el paciente ${ info.data.patient } con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualice una cita
   * @module Calendario
   * @param info Información necesaria para la notificación
   */
  public createScheduleUpdate(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/schedule';
    notification.icon = 'fa fa-calendar-alt';
    notification.message = `Has actualizado la cita del paciente ${ info.data.patient } con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se elimine una cita
   * @module Calendario
   * @param info Información necesaria para la notificación
   */
  public createScheduleDelete(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/schedule';
    notification.icon = 'fa fa-calendar-alt';
    notification.message = `Has eliminado la cita del paciente ${ info.data.patient } con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza las configuraciones del calendario
   * @module AjustesCalendario
   */
  public createChangeScheduleSetting() {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/schedule-setting';
    notification.icon = 'fa fa-calendar-alt';
    notification.message = `Has actualizado la configuración del calendario con éxito`;
    this.notificationService.saveChanges(notification);
  }

  /**
   * Notificación cuando se actualiza las fechas no disponibles
   * @param info Información necesaria para la notificación
   * @module AjustesCalendario
   */
  public createChangeScheduleSettingDate(info: INotificationStructure) {
    const notification = new Notification();
    notification.isRead = false;
    notification.createdAt = getCurrentDate();
    notification.link = '/admin/schedule-setting';
    notification.icon = 'fa fa-calendar-alt';
    notification.message = `Fueron canceladas las citas desde ${ info.data.dateStart } hasta ${ info.data.dateEnd } y los pacientes fueron notificados`;
    this.notificationService.saveChanges(notification);
  }
}
