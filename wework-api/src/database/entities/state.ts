import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { City } from './city';

@Entity()
export class State {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 100, unique: true })
  public name: string;

  @OneToMany(() => City, (city) => city.state)
  public cities: City[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
