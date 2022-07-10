import TileType from '../enums/TileType'
import Vector from '../Vector'

export default interface Logger {
  logHeadPosition(v: Vector): void
  logHeadCollision(type: TileType): void
}