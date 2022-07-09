import Vector from './Vector'
import Grid from './Grid'
import Config from './interfaces/Config'
import SnakeTile from './tiles/SnakeTile'
import FruitTile from './tiles/FruitTile'
import Direction, { directions } from './enums/Direction'
import TileType from './enums/TileType'
import BoostTile from './tiles/BoostTile'
import GridTile from './tiles/GridTile'
import ReverseTile from './tiles/ReverseTile'
import { canvas, ctx } from './canvas'
import { randomInRage } from './utils'

export default class Game {
  private intervalId?: number
  private tickrate: number

  private grid: Grid
  private powerups: Map<TileType, GridTile> = new Map()

  private snake: SnakeTile[] = []
  private moveLock: boolean = false

  public constructor(
    private readonly config: Config
  ) {
    this.tickrate = this.config.tickrate
    this.grid = new Grid(this.config.tileSize)

    this.initEvents()
    this.initSnake()

    this.spawnPowerup(TileType.Fruit)
    this.spawnPowerup(TileType.Boost)
    this.spawnPowerup(TileType.Reverse)
  }

  public start(): void {
    this.intervalId = setInterval(() => this.run(), 1000 / this.tickrate)
  }

  public run(): void {
    this.clear()

    for (const powerup of this.powerups.values()) {
      powerup.draw()
    }

    for (const fragment of this.snake) {
      fragment.draw()
    }

    this.updateSnake()
  }

  public stop(): void {
    clearInterval(this.intervalId)
  }

  private initSnake(): void {
    const direction = directions.get(Direction.Right)!

    for (let i = this.config.initLength - 1; i >= 0; i--) {
      const position = new Vector(i * this.config.tileSize, 0)
      const tile = new SnakeTile(direction, position, this.config.tileSize, 'green')

      this.snake.push(tile)
      this.grid.set(position, tile)
    }
  }

  private updateSnake(): void {
    const tail = this.snake[this.snake.length - 1]
    this.grid.set(tail.getPosition(), null)

    for (let i = this.snake.length - 2; i >= 0; i--) {
      this.snake[i + 1].setDirection(this.snake[i].getDirection())
      this.snake[i + 1].setPosition(this.snake[i].getPosition())
    }

    const head = this.snake[0]
    const headDirection = head.getDirection()

    let nextHeadPosition = head
      .getPosition()
      .add(headDirection)

    if (nextHeadPosition.x < 0 || nextHeadPosition.x >= canvas.width) {
      const modifier = headDirection.x > 0 ? -1 : 1
      nextHeadPosition = nextHeadPosition.add(new Vector(modifier * canvas.width, 0))
    }

    if (nextHeadPosition.y < 0 || nextHeadPosition.y >= canvas.height) {
      const modifier = headDirection.y > 0 ? -1 : 1
      nextHeadPosition = nextHeadPosition.add(new Vector(0, modifier * canvas.height))
    }

    head.setPosition(nextHeadPosition)
    this.checkCollision(nextHeadPosition)

    this.grid.set(nextHeadPosition, head)
    this.moveLock = false
  }

  private spawnPowerup(type: TileType): void {
    const emptyFields = this.grid.getEmpty()

    const index = randomInRage(0, emptyFields.length - 1)

    const [x, y] = emptyFields[index].split(',')
    const fruitPosition = new Vector(parseInt(x), parseInt(y))

    let powerup: GridTile = new FruitTile(fruitPosition, this.config.tileSize, 'red')

    if (type == TileType.Boost) {
      powerup = new BoostTile(fruitPosition, this.config.tileSize, 'yellow')
    } else if(type == TileType.Reverse) {
      powerup = new ReverseTile(fruitPosition, this.config.tileSize, 'purple')
    }

    this.powerups.set(type, powerup)
    this.grid.set(fruitPosition, powerup)
  }

  private checkCollision(position: Vector): void {
    const gridTile = this.grid.get(position)

    if (!gridTile) {
      return
    }

    switch (gridTile.type) {
      case TileType.Fruit:
        const head = this.snake[0]
        const tile = new SnakeTile(head.getDirection(), head.getPosition(), this.config.tileSize, 'green')

        this.snake.push(tile)

        this.spawnPowerup(TileType.Fruit)
        break

      case TileType.Boost:
        this.eat(gridTile)

        this.tickrate *= 2

        this.stop()
        this.start()

        setTimeout(() => {
          this.tickrate = this.config.tickrate

          this.stop()
          this.start()

          this.spawnPowerup(TileType.Boost)
        }, 4 * 1000)
        break

      case TileType.Reverse:
        this.eat(gridTile)

        this.snake = this.snake.reverse()

        for (const fragment of this.snake) {
          fragment.setDirection(fragment.getDirection().multiply(new Vector(-1, -1)))
        }

        this.spawnPowerup(TileType.Reverse)
        break

      case TileType.Snake:
        this.stop()
        break
    }
  }

  private eat(tile: GridTile): void {
    this.powerups.delete(tile.type)
    this.grid.set(tile.getPosition(), null)
  }

  private initEvents(): void {
    window.addEventListener('keydown', (e) => {
      if (this.moveLock) {
        return
      }

      const head = this.snake[0]
      const nextDirection = directions.get(e.key as Direction)

      if (!nextDirection) {
        return
      }

      const mult = head.getDirection().multiply(nextDirection)

      if (mult.x == 0 && mult.y == 0) {
        head.setDirection(nextDirection)
        this.moveLock = true
      }
    })
  }

  private clear(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}