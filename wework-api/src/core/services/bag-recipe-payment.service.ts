import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { BagRecipePayment } from '../../database/entities/bag-recipe-payment';

export class BagRecipePaymentService {
  public async listByBagRecipeId(bagrecipeId: number): Promise<BagRecipePayment[]> {
    return await getManager().getRepository(BagRecipePayment).find({
      where: { bagRecipe: { id: bagrecipeId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(bagRecipePayment: BagRecipePayment[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(BagRecipePayment).values(bagRecipePayment).execute();
  }

  public async remove(bagRecipeId: number): Promise<DeleteResult> {
    return await getManager().getRepository(BagRecipePayment).delete({ bagRecipe: { id: bagRecipeId } });
  }
}
