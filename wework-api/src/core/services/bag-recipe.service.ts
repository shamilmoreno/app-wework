import { Between, DeleteResult, getManager } from "typeorm";
import { BagRecipe } from "../../database/entities/bag-recipe";
import { Request, Response } from "express";

export class BagRecipeService {
  public async list(): Promise<BagRecipe[]> {
    return await getManager()
      .getRepository(BagRecipe)
      .find({
        where: { isActive: true },
        relations: [
          "items", // Productos de la receta
          "items.product", // Detalle del producto real
          "maquiladors", // Producciones por maquilador
          "maquiladors.company", // Empresa maquiladora
          "maquiladors.itemDistributions", // Distribución de productos por maquilador
          "maquiladors.itemDistributions.company", // Empresa que aportó el producto
          "maquiladors.itemDistributions.bagRecipeItem", // Producto de la receta al que pertenece
          "maquiladors.itemDistributions.bagRecipeItem.product", // Producto real
          "warehouse", // Almacén
        ],
        order: { createdAt: "DESC" },
      });
  }

  /*LISTAR RECETAS DE BOLSAS CON TODAS SUS RELACIONES, FILTRADAS POR LOS ALMACENES ASIGNADOS AL USUARIO*/
  public async listNew(req: Request, res: Response): Promise<BagRecipe[]> {
    //const warehouseIds = req.warehouseIds;
    return await getManager()
      .getRepository(BagRecipe)
      .createQueryBuilder("recipe")

      // === RELACIONES BASE ===
      .leftJoinAndSelect("recipe.items", "items")
      .leftJoinAndSelect("items.product", "product")

      // === STOCK FILTRADO POR WAREHOUSE DE LA RECETA ===
      .leftJoinAndSelect(
        "product.stock",
        "stock",
        "stock.warehouseId = recipe.warehouseId",
      )

      // === MAQUILADORES ===
      .leftJoinAndSelect("recipe.maquiladors", "maquilador")
      .leftJoinAndSelect("maquilador.company", "maqCompany")

      // === DISTRIBUCIONES ===
      .leftJoinAndSelect("maquilador.itemDistributions", "distribution")
      .leftJoinAndSelect("distribution.company", "distCompany")
      .leftJoinAndSelect("distribution.bagRecipeItem", "distItem")
      .leftJoinAndSelect("distItem.product", "distProduct")

      // === WAREHOUSE ===
      .leftJoinAndSelect("recipe.warehouse", "warehouse")

      // === FILTROS ===
      .where("recipe.isActive = true")
      .andWhere("recipe.warehouseId IN (:...warehouseIds)", {
        warehouseIds: req.warehouseIds,
      })
      .orderBy("recipe.createdAt", "DESC")

      .getMany();
  }

  public async getOne(bagRecipeId: number): Promise<BagRecipe> {
    return await getManager()
      .getRepository(BagRecipe)
      .findOne({
        where: { id: bagRecipeId, isActive: true },
        relations: [
          "items",
          "items.bagRecipe",
          "items",
          "items.product",
          "items.product.stock",
          "payments",
          "maquiladors",
          "maquiladors.company",
          "maquiladors.itemDistributions",
          "maquiladors.itemDistributions.company",
          "maquiladors.itemDistributions.bagRecipeItem",
          "maquiladors.itemDistributions.bagRecipeItem.product",
          "warehouse",
        ],
        order: {
          items: {
            product: {
              name: "ASC",
            },
          },
        },
      });
  }

  public async getOneForDetail(bagRecipeId: number): Promise<BagRecipe> {
    return await getManager()
      .getRepository(BagRecipe)
      .findOne({
        where: { id: bagRecipeId, isActive: true },
        relations: [
          "items",
          "items.product",
          "items.product.stock",
          "payments",
          "maquiladors",
          "maquiladors.company",
          "maquiladors.itemDistributions",
          "maquiladors.itemDistributions.company",
          "maquiladors.itemDistributions.bagRecipeItem",
          "maquiladors.itemDistributions.bagRecipeItem.product",
          "warehouse",
        ],
        order: {
          items: {
            product: {
              name: "ASC",
            },
          },
        },
      });
  }

  public async getByDateFilter(init: string, end: string): Promise<BagRecipe[]> {
    return await getManager()
      .getRepository(BagRecipe)
      .find({
        where: {
          monthRecipeBag: Between(init, end),
          isActive: true,
        },
        relations: [
          "items",
          "items.product",
          "items.product.stock",
          "payments",
          "maquiladors",
          "maquiladors.company",
          "maquiladors.itemDistributions",
          "maquiladors.itemDistributions.company",
          "maquiladors.itemDistributions.bagRecipeItem",
          "maquiladors.itemDistributions.bagRecipeItem.product",
          "warehouse",
        ],
        order: {
          items: {
            product: {
              name: "ASC",
            },
          },
        },
      });
  }

  public async getOneOnlyObject(bagRecipeId: number): Promise<BagRecipe> {
    return await getManager()
      .getRepository(BagRecipe)
      .findOne({ where: { id: bagRecipeId } });
  }

  public async saveChanges(bagRecipe: BagRecipe): Promise<BagRecipe> {
    return await getManager().getRepository(BagRecipe).save(bagRecipe);
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipe).delete(bagRecipeId);
  }

  public async update(bagRecipe: BagRecipe): Promise<BagRecipe> {
    return await getManager().getRepository(BagRecipe).save(bagRecipe);
  }
}
