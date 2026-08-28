import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WareHouse } from './warehouse ';
import { User } from './user';

@Entity()
export class UserWarehouse  {
   @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, user => user.userWarehouses, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => WareHouse, warehouse => warehouse.userWarehouses, { onDelete: 'CASCADE' })
  warehouse: WareHouse;
}
