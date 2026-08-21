import { DeleteResult, getManager, InsertResult } from 'typeorm';
import { UserRole } from '../../database/entities/user.role';

export class UserRoleService {
  public async listByUsertId(userId: number): Promise<UserRole[]> {
    return await getManager().getRepository(UserRole).find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  public async saveChanges(userRole: UserRole[]): Promise<InsertResult> {
    return await getManager().createQueryBuilder().insert().into(UserRole).values(userRole).execute();
  }

  public async remove(userId: number): Promise<DeleteResult> {
    return await getManager().getRepository(UserRole).delete({ user: { id: userId } });
  }
}
