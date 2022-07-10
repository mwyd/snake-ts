import TileType from '../enums/TileType'
import Logger from '../interfaces/Logger'
import Vector from '../Vector'

export default class DebugLogger implements Logger {
  logHeadPosition(v: Vector): void {
    console.log(`[DEBUG] head position [${v}]`)
  }

  logHeadCollision(type: TileType): void {
    console.log(`[DEBUG] collision with ${type}`)
  }
}