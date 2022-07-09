
import GridTile from './GridTile'
import TileType from '../enums/TileType'

export default class FruitTile extends GridTile {
  public readonly type: TileType = TileType.Fruit
}