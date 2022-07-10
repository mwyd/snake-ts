import TileType from '../enums/TileType'
import Drawable from '../interfaces/Drawable'
import Vector from '../Vector'
import config from '../../config'
import { ctx } from '../canvas'

export default class GridTile implements Drawable {
  public readonly type: TileType = TileType.None

  public constructor(
    protected position: Vector,
    protected direction: Vector,
    public readonly size: number,
    public readonly color: string
  ) {}

  public getPosition(): Vector {
    return this.position
  }

  public setPosition(v: Vector): void {
    this.position = v
  }

  public setDirection(v: Vector): void {
    this.direction = v
  }

  public getDirection(): Vector {
    return this.direction
  }

  public draw(): void {
    ctx.fillStyle = this.color
    ctx.fillRect(this.position.x, this.position.y, this.size, this.size)

    if (config.debug) {
      this.drawBounds()
      this.drawDirection()
    }
  }

  private drawBounds(): void {
    const { x, y } = this.position

    ctx.strokeStyle = 'lightgrey'

    ctx.beginPath()
    ctx.moveTo(x, y)

    ctx.lineTo(x + this.size, y)
    ctx.lineTo(x + this.size, y + this.size)
    ctx.lineTo(x, y + this.size)
    ctx.lineTo(x, y)

    ctx.stroke()
  }

  private drawDirection(): void {
    const { x, y } = this.position

    const center = new Vector(x + this.size / 2, y + this.size / 2)
    const mult = center.add(this.direction)

    ctx.fillStyle = 'lime'
    ctx.strokeStyle = 'lime'

    ctx.beginPath()

    ctx.moveTo(center.x, center.y)
    ctx.lineTo(mult.x, mult.y)

    ctx.stroke()

    const squareSize = 4

    ctx.fillRect(
      center.x - squareSize / 2, 
      center.y - squareSize / 2, 
      squareSize, squareSize
    )
  }
}