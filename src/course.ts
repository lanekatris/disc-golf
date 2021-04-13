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
  zip: number;

  @Column()
  holeCount: number;

  @Column({ nullable: true })
  rating?: number;

  // constructor(
  //   public id?: string,
  //   public name?: string,
  //   public city?: string,
  //   public state?: string,
  //   public zip?: number,
  //   public holeCount?: number,
  //   public rating?: number,
  // ) {}

  constructor(id: string, name: string, city: string, state: string, zip: number, holeCount: number, rating: number) {
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
