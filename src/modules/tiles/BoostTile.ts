import Drawable from '../interfaces/Drawable'
import GridTile from './GridTile'
import TileType from '../enums/TileType'
import { ctx } from '../canvas'

export default class BoostTile extends GridTile implements Drawable {
  public readonly type: TileType = TileType.Boost

  public draw(): void {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size)
  }
}