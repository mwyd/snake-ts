import TileType from '../enums/TileType'
import Logger from '../interfaces/Logger'
import Vector from '../Vector'

export default class NullLogger implements Logger {
  logHeadPosition(v: Vector): void {
    // 
  }

  logHeadCollision(type: TileType): void {
    //
  }
}