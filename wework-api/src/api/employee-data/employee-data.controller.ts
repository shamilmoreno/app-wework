import { sanitize } from 'class-sanitizer';
import { validate } from 'class-validator';
import { Request, Response } from 'express';
import moment from 'moment';
import messages from '../../core/helpers/messages';
import { getCurrentDate } from '../../core/helpers/str-utils';
import { NotificationMiddleware } from '../../core/middlewares/notification.middleware';
import { EmployeeDataService } from '../../core/services/employee-data.service';
import { HttpResponseService } from '../../core/services/http-response.service';
import { EmployeeData } from '../../database/entities/employee-data';

export class EmployeeDataController {
  /**
   * Cargar todos los empleados de la base de datos
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlList(req: Request, res: Response): Promise<void> {
    try {
      const employeeDataService = new EmployeeDataService();
      const employees: EmployeeData[] = await employeeDataService.list();
      HttpResponseService.response(res, 200, employees, '');
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Cargar paciente por Id del paciente
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlGetOne(req: Request, res: Response): Promise<void> {
    try {
      // Find employee
      const employeeDataService = new EmployeeDataService();

      // Find employee
      const employee: EmployeeData = await employeeDataService.getOne(parseInt(req.params.id));

      // Valid the info
      if (employee) {
        HttpResponseService.response(res, 200, employee, '');
      } else {
        HttpResponseService.response(res, 404, null, messages.employee.employeeNotFound);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Cargar paciente para validar la información
   * @param req Solicitud
   * @param res Respuesta
   */
 /* public async ctrlGetOneForDataValidation(req: Request, res: Response): Promise<void> {
    try {
      // Find employee
      const employeeDataService = new EmployeeDataService();

      // Creating a instance of User
      const dt = req.body.documentType;
      const dn = req.body.documentNumber;
      const bd = moment(req.body.birthdate).format('YYYY-MM-DD');
      const onlineType = req.body.onlineType;

      // Find employee
      const employee: Employee = await employeeDataService.getOneForDataValidation(dt, dn, bd);

      // Build message to error
      let messageResponse = '';
      if (onlineType === 'budget-payment') {
        messageResponse = messages.employee.employeeDataValidationBudgetError;
      } else if (onlineType === 'appointment') {
        messageResponse = messages.employee.employeeDataValidationScheduleError;
      }

      // Valid the info
      if (employee) {
        HttpResponseService.response(res, 200, employee, messages.employee.employeeDataValidationSuccess);
      } else {
        HttpResponseService.response(res, 500, null, messageResponse);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }*/

  /**
   * Cargar detalle del paciente por Id del paciente
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlGetOneForDetail(req: Request, res: Response): Promise<void> {
    try {
      const employeeDataService = new EmployeeDataService();

      // Find employee
      const employee: EmployeeData = await employeeDataService.getOneForDetail(parseInt(req.params.id));

      // Valid the info
      if (employee) {
        HttpResponseService.response(res, 200, employee, '');
      } else {
        HttpResponseService.response(res, 404, null, messages.employee.employeeNotFound);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Crear a un nuevo paciente
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlCreate(req: Request, res: Response): Promise<void> {
    try {
      const employeeDataService = new EmployeeDataService();

      // Creating a instance of User
      const employee = new EmployeeData();
      employee.documentType = req.body.documentType;
      employee.documentNumber = req.body.documentNumber;
      employee.gender = req.body.gender;
      employee.birthdate = req.body.birthdate;
      employee.address = req.body.address;
      employee.country = req.body.country;
      employee.phone = req.body.phone;
      employee.createdAt = getCurrentDate();

      // Sanitize data
      sanitize(employee);

      // Save Changes
      const result = await employeeDataService.saveChanges(employee);
      HttpResponseService.response(res, 200, result, messages.employee.employeeCreated);
    } catch (error) {
      if (error.detail.search('documentNumber') !== -1) {
        HttpResponseService.response(res, 500, error, messages.employee.employeeDocumentNumberExists);
      } else if (error.detail.search('email') !== -1) {
        HttpResponseService.response(res, 500, error, messages.employee.employeeEmailExists);
      } else {
        HttpResponseService.response(res, 500, error, messages.general.error);
      }
    }
  }

  /**
   * Actualización de un paciente
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlUpdate(req: Request, res: Response): Promise<void> {
    try {
      const employeeDataService = new EmployeeDataService();

      // Find employee
      const employee: EmployeeData = await employeeDataService.getOne(req.body.id);

      // Return data
      if (employee) {
        employee.documentType.id = req.body.documentType;
        employee.documentNumber = req.body.documentNumber;
        employee.gender.id = req.body.gender;
        employee.birthdate = req.body.birthdate;
        employee.address = req.body.address;
        employee.country.id = req.body.country;
        employee.phone = req.body.phone;

        // Validate data User
        const errorsemployee = await validate(employee);
        if (errorsemployee.length > 0) {
          HttpResponseService.response(res, 400, errorsemployee, messages.general.error);
        }

        // Sanitize data
        sanitize(employee);

        // Save Changes
        const result = await employeeDataService.saveChanges(employee);
        HttpResponseService.response(res, 200, result, messages.employee.employeeUpdated);
      } else {
        HttpResponseService.response(res, 404, null, messages.employee.employeeNotFound);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }

  /**
   * Eliminar paciente
   * @param req Solicitud
   * @param res Respuesta
   */
  public async ctrlRemove(req: Request, res: Response): Promise<void> {
    try {
      // Search Doctor
      const employeeDataService = new EmployeeDataService();
      const employee: EmployeeData = await employeeDataService.getOne(parseInt(req.params.id));
      const notificationMiddleware = new NotificationMiddleware();

      // Return data
      if (employee) {
        // Create a notification
        /*notificationMiddleware.createemployeeDelete({
          data: {
            employee: `${ employee.firstName } ${ employee.lastName }`,
          },
        });*/

        // Result
        const data = await employeeDataService.remove(employee.id);
        HttpResponseService.response(res, 200, data, messages.employee.employeeDeleted);
      } else {
        HttpResponseService.response(res, 404, null, messages.employee.employeeNotFound);
      }
    } catch (error) {
      HttpResponseService.response(res, 500, error, messages.general.error);
    }
  }
}
