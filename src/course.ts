export class Course {
  // id: string;
  // name: string;
  // city: string;
  // state: string;
  // zip: number;
  // holeCount: number;
  // rating: number;

  constructor(
    public id?: string,
    public name?: string,
    public city?: string,
    public state?: string,
    public zip?: number,
    public holeCount?: number,
    public rating?: number
  ) {}

  serializeLocation(): string {
    return `${this.name} ${this.city}, ${this.state} ${this.zip}`;
  }
}
