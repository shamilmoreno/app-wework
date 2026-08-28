import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { BagRecipeItem } from '../../database/entities/bag-recipe-item';

export class BagRecipeItemService {
  public async listItemsByBagRecipeId(bagrecipeId: number): Promise<BagRecipeItem[]> {
    return await getManager().getRepository(BagRecipeItem).find({
      relations:['product', 'bagRecipe.items'],
      where: { bagRecipe: { id: bagrecipeId } },
      order: { id: 'DESC' }
    });
  }

  public async saveChanges(bagRecipeItem: BagRecipeItem[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(BagRecipeItem).values(bagRecipeItem).execute();
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipeItem).delete({ bagRecipe: { id: bagRecipeId } });
  }
}
