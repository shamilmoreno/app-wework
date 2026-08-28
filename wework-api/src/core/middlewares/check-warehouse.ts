import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { UserWarehouse } from '../../database/entities/user-warehouse ';
import { HttpResponseService } from '../../core/services/http-response.service';

export const checkWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user.userWarehouses || user.userWarehouses.length === 0) {
            return HttpResponseService.response(res, 400, null, 'El usuario no tiene warehouses asignados');
        }

        // User puede tener 1 o varios warehouses
        const warehouseIds = user.userWarehouses.map(uw => uw.warehouse.id);

        // Si tiene activo uno, ese va primero
        if (user.activeWarehouseId && warehouseIds.includes(user.activeWarehouseId)) {
            req.warehouseIds = [user.activeWarehouseId, ...warehouseIds.filter(id => id !== user.activeWarehouseId)];
        } else {
            req.warehouseIds = warehouseIds;
        }

        next();
    } catch (error) {
        return HttpResponseService.response(res, 500, error, 'Error validando warehouse');
    }
};
