import GridTile from './GridTile'
import TileType from '../enums/TileType'

export default class ReverseTile extends GridTile {
  public readonly type: TileType = TileType.Reverse
}