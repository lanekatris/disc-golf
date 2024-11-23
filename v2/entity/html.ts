import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Html {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  state!: string;

  @Column()
  page!: number;

  @Column()
  url!: string;

  @Column()
  html!: string;

  @Column({ default: () => "current_timestamp" })
  createdOn!: string;
}
