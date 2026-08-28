import { SubcategoryModel } from './subcategory.model';
export class CustomerDataModel {
  id?: number;
  businessName?: string;
  documentNumber?: number;
  identificationCard?: string;
  email?: string;
  birthdate?: string;
  address?: string;
  phone?: any;
  instalationDate?: string;
  publicIp?: string;
  isActive?: any;
  installationCost?: number;
  paymentMethod?: string;
  consultingContractor?: number;
  responsibleEngineer?: string;
  retention?: string;
  seller?: string;
  isConditionalPayment?: any;
  explainConditionalPayment?: string;
  createdAt?: string;

  documentType?: SubcategoryModel;
  customerType?: SubcategoryModel;
  municipality?: SubcategoryModel;
  plan?: SubcategoryModel;

  pendingProforma?: any[];
  proformaPaid?: any[];

}
