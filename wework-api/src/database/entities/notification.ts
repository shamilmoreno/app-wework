import { Trim } from 'class-sanitizer';
import { MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public icon: string;

  @Column({ length: 500 })
  @MaxLength(500, { message: 'El campo <message> es demasiado largo' })
  @MinLength(3, { message: 'El campo <message> es demasiado corto' })
  @Trim()
  public message: string;

  @Column({ default: false })
  public isRead: boolean;

  @Column()
  public link: string;

  @Column({ type: 'date' })
  public createdAt: string;
}
