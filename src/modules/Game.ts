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
import GameState from './enums/GameState'
import Logger from './interfaces/Logger'
import NullLogger from './loggers/NullLogger'
import { canvas, ctx } from './canvas'
import { randomInRage } from './utils'

const negationVector = new Vector(-1, -1)

export default class Game {
  private intervalId?: number
  private tickrate: number

  private grid: Grid
  private powerups: Map<TileType, GridTile> = new Map()

  private snake: SnakeTile[] = []
  private moveLock: boolean = false

  private gameState!: GameState

  public constructor(
    private readonly config: Config,
    private logger: Logger = new NullLogger()
  ) {
    this.tickrate = this.config.tickrate
    this.grid = new Grid(this.config.tileSize)

    this.initSnake()
    this.initPowerups()
    this.initEvents()
  }

  public start(): void {
    this.gameState = GameState.Running
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
    this.gameState = GameState.Finished
    clearInterval(this.intervalId)
  }

  public setLogger(logger: Logger): void {
    this.logger = logger
  }

  private initSnake(): void {
    const direction = directions.get(Direction.Right)!
    
    for (let i = this.config.initLength - 1; i >= 0; i--) {
      const tile = new SnakeTile(
        new Vector(i * this.config.tileSize, 0), 
        direction, 
        this.config.tileSize, 
        this.config.snakeColor
      )

      this.snake.push(tile)
      this.grid.set(tile.getPosition(), tile)
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

    this.logger.logHeadPosition(head.getPosition())

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

    const position = emptyFields[index]
    const direction = directions.get(Direction.Right)!

    const defaultParams: [Vector, Vector, number] = [position, direction, this.config.tileSize]

    let powerup: GridTile = new FruitTile(
      ...defaultParams,
      this.config.fruitColor
    )

    if (type == TileType.Boost) {
      powerup = new BoostTile(
        ...defaultParams,
        this.config.boostColor
      )
    } else if(type == TileType.Reverse) {
      powerup = new ReverseTile(
        ...defaultParams,
        this.config.reverseColor
      )
    }

    this.powerups.set(type, powerup)
    this.grid.set(position, powerup)
  }

  private checkCollision(position: Vector): void {
    const tile = this.grid.get(position)

    if (!tile) {
      return
    }

    this.logger.logHeadCollision(tile.type)

    switch (tile.type) {
      case TileType.Fruit:
        this.activateFruit()
        break

      case TileType.Boost:
        this.activateBoost(tile)
        break

      case TileType.Reverse:
        this.activateReverse(tile)
        break

      case TileType.Snake:
        this.stop()
        break
    }
  }

  private activateFruit(): void {
    const tail = this.snake[this.snake.length - 1]
        
    const snakeFragment = new SnakeTile(
      tail.getPosition().add(tail.getDirection().multiply(negationVector)), 
      tail.getDirection(), 
      this.config.tileSize, 
      this.config.snakeColor
    )

    this.snake.push(snakeFragment)
    this.grid.set(snakeFragment.getPosition(), snakeFragment)

    this.spawnPowerup(TileType.Fruit)
  }

  private activateBoost(tile: GridTile): void {
    this.eat(tile)

    this.tickrate *= 2

    this.stop()
    this.start()

    setTimeout(() => {
      if (this.gameState != GameState.Running) {
        return
      }

      this.tickrate = this.config.tickrate

      this.stop()
      this.start()

      this.spawnPowerup(TileType.Boost)
    }, this.config.boostTimeout)
  }

  private activateReverse(tile: GridTile): void {
    this.eat(tile)

    this.snake = this.snake.reverse()

    for (let i = this.snake.length - 2; i >= 0; i--) {
      const prev = this.snake[i + 1]
      const curr = this.snake[i]

      const mult = prev.getDirection().multiply(curr.getDirection())

      const direction = mult.x == 0 && mult.y == 0
        ? curr.getDirection()
        : prev.getDirection()

      prev.setDirection(direction.multiply(negationVector))
    }

    const head = this.snake[0]
    head.setDirection(head.getDirection().multiply(negationVector))

    this.spawnPowerup(TileType.Reverse)
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

  private initPowerups(): void {
    this.spawnPowerup(TileType.Fruit)
    this.spawnPowerup(TileType.Boost)
    this.spawnPowerup(TileType.Reverse)
  }

  private clear(): void {
    ctx.fillStyle = this.config.boardColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}