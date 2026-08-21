import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BagRecipeMaquilador } from "./bag-recipe-maquilador";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 500,
    nullable: false,
    comment: "Nombre comercial o razón social de la empresa",
  })
  @IsString({ message: "El campo <businessName> debe ser una cadena de texto" })
  @IsNotEmpty({ message: "El campo <businessName> no puede estar vacío" })
  @Length(3, 500, {
    message: "El campo <businessName> debe tener entre 3 y 500 caracteres",
  })
  businessName: string;

  @Column({
    length: 12,
    unique: true,
    comment: "RIF de la compañía (Formato: J-123456789-0)",
  })
  @IsNotEmpty({
    message: "El campo <documentNumber> (RIF) no puede estar vacío",
  })
  @Matches(/^[JGVEjgve][-][0-9]{8,9}[-][0-9]$/, {
    message: "El RIF debe tener el formato correcto (Ej: J-12345678-9)",
  })
  documentNumber: string; // Formato RIF: J-12345678-9

  @Column({
    length: 500,
    nullable: true,
    comment: "Dirección física de la empresa",
  })
  @ValidateIf((o) => o.address !== null && o.address !== undefined)
  @IsString({ message: "El campo <address> debe ser una cadena de texto" })
  @Length(0, 500, {
    message: "El campo <address> no puede exceder los 500 caracteres",
  })
  address?: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    comment: "Fecha de creación del registro",
  })
  createdAt: Date;

  // Relations
  @OneToMany(() => BagRecipeMaquilador, (assignment) => assignment.company)
  public maquiladorAssignments: BagRecipeMaquilador[];
}
