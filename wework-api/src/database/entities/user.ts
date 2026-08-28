import * as bcrypt from 'bcrypt';
import { Trim } from 'class-sanitizer';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Subcategory } from './subcategory';
import { UserRole } from './user.role';
import { UserWarehouse } from './user-warehouse ';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column({ length: 20 })
    @MaxLength(20, { message: 'El campo <firstName> es demasiado largo' })
    @MinLength(3, { message: 'El campo <firstName> es demasiado corto' })
    @Trim()
    public firstName!: string;

    @Column({ length: 20 })
    @MaxLength(20, { message: 'El campo <lastName> es demasiado largo' })
    @MinLength(3, { message: 'El campo <lastName> es demasiado corto' })
    @Trim()
    public lastName!: string;

    @Column({ unique: true })
    @IsEmail()
    public email!: string;

    @Column()
    public password!: string;

    @Column({ nullable: true })
    public token?: string | null;

    @Column({ nullable: true })
    public activeWarehouseId?: number;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    public updatedAt!: Date;

    // Methods
    public hashPassword() {
        this.password = bcrypt.hashSync(this.password, 8);
    }

    public checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }

    // RELATIONS
    @ManyToOne(() => Subcategory, subcategory => subcategory.id, { onDelete: 'SET NULL' })
    public gender!: Subcategory;

    @OneToMany(() => UserRole, userRole => userRole.user)
    public userRoles!: UserRole[];

    @OneToMany(() => UserWarehouse, uw => uw.user)
    public userWarehouses!: UserWarehouse[];


}
