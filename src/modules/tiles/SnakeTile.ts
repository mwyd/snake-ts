import GridTile from './GridTile'
import TileType from '../enums/TileType'

export default class SnakeTile extends GridTile {
  public readonly type: TileType = TileType.Snake
}