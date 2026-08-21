import { SubcategoryModel } from './subcategory.model';
export class CategoryModel {
  id?: number;
  name?: string;
  description?: string;
  editable?: boolean;
  subcategories?: SubcategoryModel[];
}
