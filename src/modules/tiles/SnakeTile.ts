import GridTile from './GridTile'
import TileType from '../enums/TileType'
import Vector from '../Vector'

export default class SnakeTile extends GridTile {
  public readonly type: TileType = TileType.Snake

  public constructor(
    protected direction: Vector,
    protected position: Vector,
    public readonly size: number,
    public readonly color: string
  ) {
    super(position, size, color)
  }

  public setDirection(v: Vector): void {
    this.direction = v
  }

  public getDirection(): Vector {
    return this.direction
  }
}