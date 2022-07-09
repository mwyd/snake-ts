export default class Vector {
  public constructor(
    public readonly x: number,
    public readonly y: number 
  ) {}

  public add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y)
  }

  public multiply(v: Vector): Vector {
    return new Vector(this.x * v.x, this.y * v.y)
  }

  public toString(): string {
    return `${this.x},${this.y}`
  }
}