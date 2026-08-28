import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from "typeorm";

@Entity({ name: "exchange-rates" })
@Unique(["date", "time_of_day"])
export class ExchangeRate {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ type: "date" })
    public date: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    public usd_rate: number;

    @Column({ type: "text", default: "BANCO CENTRAL DE VENEZUELA" })
    public source: string;

    @Column({
        type: "varchar",
        length: 20,
        nullable: true,
        default: null,
        comment: "morning o evening",
    })
    public time_of_day: string | null;

    @CreateDateColumn({ type: "timestamp" })
    public createdAt: Date;
}