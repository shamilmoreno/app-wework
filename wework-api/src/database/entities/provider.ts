import { Trim } from 'class-sanitizer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Provider {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true, nullable: false })
  @MaxLength(50, { message: 'El campo <identificationNumber> es demasiado largo' })
  @MinLength(3, { message: 'El campo <identificationNumber> es demasiado corto' })
  @Trim()
  public identificationNumber: string;

  @Column({ length: 500 })
  @MaxLength(500, { message: 'El campo <businessName> es demasiado largo' })
  @MinLength(3, { message: 'El campo <businessName> es demasiado corto' })
  @Trim()
  public businessName: string;

  @Column({ unique: false })
  @IsEmail()
  public email: string;

  @Column({ length: 500 })
  @MaxLength(500, { message: 'El campo <address> es demasiado largo' })
  @MinLength(3, { message: 'El campo <address> es demasiado corto' })
  @Trim()
  public address: string;

  @Column({ default: true })
  public isActive: boolean;

  @Column({ type: 'date' })
  public createdAt: string;
}
