import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEnum, MaxLength, MinLength } from 'class-validator';
import { Trim } from 'class-sanitizer';
import { MovementType } from '../../core/enums/movement-type.enum'
import { Product } from './product';
import { WareHouse } from './warehouse ';

@Entity()
export class InventoryMovement {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ type: 'varchar' })
	public guideNumber: string;

	@Column({ type: 'int' })
	//@IsInt({ message: 'La cantidad debe ser un número entero' })
	public quantity: number;

	@Column({ type: 'date' })
	public date: string;

	@Column({ length: 50 })
	@MaxLength(50, { message: 'El campo <Destino> es demasiado largo' })
	@MinLength(3, { message: 'El campo <Destino> es demasiado corto' })
	@Trim()
	public destination: string;

	@Column({ length: 200 })
	@MaxLength(200, { message: 'El campo <Descripcion> es demasiado largo' })
	@MinLength(3, { message: 'El campo <Descripcion> es demasiado corto' })
	@Trim()
	public description: string;

	@Column({ length: 50 })
	@MaxLength(50, { message: 'El campo <Responsable> es demasiado largo' })
	@MinLength(3, { message: 'El campo <Responsable> es demasiado corto' })
	@Trim()
	public responsibleUser: string;

	@Column({ type: 'int', default: 0 }) // Refleja el stock después del movimiento
	public stockAfterMovement: number;

	@Column({ type: 'enum', enum: MovementType })
	@IsEnum(MovementType, { message: 'Tipo de movimiento inválido' })
	public movementType: MovementType;

	@CreateDateColumn({ type: "timestamp" })
	public createdAt: Date;

	@UpdateDateColumn({ type: "timestamp" })
	public updatedAt: Date;

	/**
	  * Relación genérica que indica el origen del movimiento.
	  * 
	  * - `referenceType`: debe guardar el nombre del tipo de entidad que originó el movimiento.
	  *    Ejemplos comunes: 'BagRecipe', 'ManualInput', 'ManualOutput', 'ReturnNote', 'PurchaseOrder'.
	  * 
	  * - `referenceId`: debe guardar el ID de la entidad asociada, si aplica.
	  *    Ejemplo: si `referenceType = 'BagRecipe'`, entonces `referenceId = id` del BagRecipe.
	  * 
	  * Esto permite rastrear el origen de cada movimiento sin acoplar la tabla a múltiples relaciones.
	  */
	@Column({ type: 'varchar', length: 50, nullable: true })
	public referenceType: string | null;

	@Column({ type: 'varchar', length: 50, nullable: true })
	public referenceId: string;

		// RELATIONS
	@ManyToOne(() => Product, { onDelete: "SET NULL" })
	public product: Product;

	@ManyToOne(() => WareHouse, (w) => w.movements, { onDelete: "CASCADE" })
	public warehouse: WareHouse;

}


