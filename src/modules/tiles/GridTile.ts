import TileType from '../enums/TileType'
import Drawable from '../interfaces/Drawable'
import Vector from '../Vector'
import { ctx } from '../canvas'

export default class GridTile implements Drawable {
  public readonly type: TileType = TileType.None

  public constructor(
    protected position: Vector,
    public readonly size: number,
    public readonly color: string
  ) {}

  public getPosition(): Vector {
    return this.position
  }

  public setPosition(v: Vector): void {
    this.position = v
  }

  public draw(): void {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
  }
}