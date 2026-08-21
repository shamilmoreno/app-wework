import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { BagRecipeProduct } from '../../database/entities/bag-recipe-product';

export class BagRecipeProductService {
  public async listProductsByBagRecipeId(bagrecipeId: number): Promise<BagRecipeProduct[]> {
    return await getManager().getRepository(BagRecipeProduct).find({
      relations:['product', 'bagRecipe.products'],
      where: { bagRecipe: { id: bagrecipeId } },
      order: { id: 'DESC' }
    });
  }

  public async saveChanges(bagRecipeProduct: BagRecipeProduct[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(BagRecipeProduct).values(bagRecipeProduct).execute();
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipeProduct).delete({ bagRecipe: { id: bagRecipeId } });
  }
}
