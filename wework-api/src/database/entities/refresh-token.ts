import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public token: string; // Un hash aleatorio

    @Column()
    public expiresAt: Date; // Fecha límite de inactividad (ej. 7 días)

    @CreateDateColumn()
    public createdAt: Date;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    public user: User;
}
