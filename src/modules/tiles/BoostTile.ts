import GridTile from './GridTile'
import TileType from '../enums/TileType'

export default class BoostTile extends GridTile {
  public readonly type: TileType = TileType.Boost
}