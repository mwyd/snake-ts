import TileType from '../enums/TileType'
import Vector from '../Vector'

export default class GridTile {
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
}