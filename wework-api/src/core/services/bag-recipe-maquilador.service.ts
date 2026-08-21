import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { BagRecipeMaquilador } from '../../database/entities/bag-recipe-maquilador';

export class BagRecipeMaquiladorService {
  public async listByBagRecipeId(bagrecipeId: number): Promise<BagRecipeMaquilador[]> {
    return await getManager().getRepository(BagRecipeMaquilador).find({
      where: { bagRecipe: { id: bagrecipeId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(bagRecipeMaquilador: BagRecipeMaquilador[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(BagRecipeMaquilador).values(bagRecipeMaquilador).execute();
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipeMaquilador).delete({ bagRecipe: { id: bagRecipeId } });
  }
}
