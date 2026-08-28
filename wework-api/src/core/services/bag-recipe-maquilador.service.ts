import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { BagRecipeMaquiladorProduction } from '../../database/entities/bag-recipe-maquilador-production';

export class BagRecipeMaquiladorService {
  public async listByBagRecipeId(bagrecipeId: number): Promise<BagRecipeMaquiladorProduction[]> {
    return await getManager().getRepository(BagRecipeMaquiladorProduction).find({
      where: { bagRecipe: { id: bagrecipeId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(bagRecipeMaquilador: BagRecipeMaquiladorProduction[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(BagRecipeMaquiladorProduction).values(bagRecipeMaquilador).execute();
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipeMaquiladorProduction).delete({ bagRecipe: { id: bagRecipeId } });
  }
}
