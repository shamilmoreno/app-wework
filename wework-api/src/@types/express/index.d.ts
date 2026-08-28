import { User } from '../../database/entities/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;          // Usuario logueado
      warehouseIds?: number[]; // Warehouse activo
    }
  }
}
