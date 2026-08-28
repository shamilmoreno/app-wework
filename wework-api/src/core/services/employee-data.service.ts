import { Between, DeleteResult, getManager } from 'typeorm';
import { EmployeeData } from '../../database/entities/employee-data';

export class EmployeeDataService {
  public async list(): Promise<EmployeeData[]> {
    return await getManager().getRepository(EmployeeData).find({
      //select: ['id', 'firstName', 'lastName', 'documentNumber', 'phone', 'email'],
      relations: ['documentType'],
      order: { id: 'DESC' },
    });
  }

  /*public async getByDateFilter(init: string, end: string): Promise<[Employee[], number]> {
    return await getManager().getRepository(Employee).findAndCount({ createdAt: Between(init, end) });
  }*/

  public async getOne(patientId: number): Promise<EmployeeData> {
    return await getManager().getRepository(EmployeeData).findOne({
      relations: ['documentType', 'gender', 'country'],
      where: { id: patientId },
    });
  }

 /* public async getOneForDataValidation(
    dvDocumentType: number, dvDocumentNumber: number, dvBirthdate: string): Promise<Employee> {
    return await getManager().getRepository(Employee).findOne({
      relations: [
        'medicalQuery',
        'medicalQuery.medicalDiagnosis',
        'medicalQuery.medicalDiagnosis.state',
        'budget',
        'budget.state',
        'budget.detail',
        'schedule',
        'schedule.motive',
      ],
      where: {
        documentType: dvDocumentType,
        documentNumber: dvDocumentNumber,
        birthdate: dvBirthdate,
      },
    });
  }*/

  public async getOneForDetail(employeeDataId: number): Promise<EmployeeData> {
    return await getManager().getRepository(EmployeeData).findOne({
      relations: [
        'documentType',
        'gender',
        'country',
        'medicalStory',
        'medicalQuery',
        'medicalQuery.medicalDiagnosis',
        'medicalQuery.medicalDiagnosis.state',
        'medicalQuery.payment',
        'budget',
        'budget.state',
        'budget.payment',
        'schedule',
        'schedule.motive',
      ],
      where: { id: employeeDataId },
    });
  }

  public async saveChanges(employeeData: EmployeeData): Promise<EmployeeData> {
    return await getManager().getRepository(EmployeeData).save(employeeData);
  }

  public async remove(employeeDataId: number): Promise<DeleteResult> {
    return await getManager().getRepository(EmployeeData).delete(employeeDataId);
  }
}
