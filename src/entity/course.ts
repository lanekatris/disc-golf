import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  holeCount: number;

  @Column({ nullable: true })
  rating?: number;

  @Column({ nullable: true })
  rawLocationData?: string;

  @Column({ default: 0 })
  didFindLocations!: boolean;

  // eslint-disable-next-line max-len
  constructor(id: string, name: string, city: string, state: string, zip: string, holeCount: number, rating: number) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.holeCount = holeCount;
    this.rating = rating;
  }

  serializeLocation(): string {
    return `${this.name} ${this.city}, ${this.state} ${this.zip}`;
  }
}
