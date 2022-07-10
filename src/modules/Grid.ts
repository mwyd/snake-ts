import GridTile from './tiles/GridTile'
import Vector from './Vector'
import { canvas } from './canvas'

export default class Grid {
  private structure: Map<string, GridTile|null> = new Map()

  public constructor(
    private readonly tileSize: number
  ) {
    this.initStructure()
  }

  public set(key: Vector, value: GridTile|null): void {
    this.structure.set(key.toString(), value)
  }

  public get(key: Vector): GridTile|null {
    return this.structure.get(key.toString()) || null
  }

  public getEmpty(): string[] {
    const empty = []

    for (let [key, tile] of this.structure) {
      if (!tile) {
        empty.push(key)
      }
    }

    return empty
  }

  private initStructure(): void {
    for (let i = 0; i < canvas.width / this.tileSize; i++) {
      for (let j = 0; j < canvas.height / this.tileSize; j++) {
        this.set(
          new Vector(i * this.tileSize, j * this.tileSize), 
          null
        )
      }
    }
  }
}