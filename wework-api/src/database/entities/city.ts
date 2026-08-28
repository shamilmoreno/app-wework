import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { State } from './state';
import { WareHouse } from './warehouse ';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100 })
  public name: string;

  @ManyToOne(() => State, (state) => state.cities, { onDelete: 'CASCADE' })
  public state: State;

  @OneToMany(() => WareHouse, (warehouse) => warehouse.city)
  public warehouses: WareHouse[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
