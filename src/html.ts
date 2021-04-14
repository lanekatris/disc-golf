import {
  Entity, Column, PrimaryGeneratedColumn,
} from 'typeorm';

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
}
