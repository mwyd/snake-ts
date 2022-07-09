import config from '../../config'
import Vector from '../Vector'

enum Direction {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd'
}

export default Direction

export const directions: Map<Direction, Vector> = new Map([
  [Direction.Up, new Vector(0, -config.tileSize)],
  [Direction.Down, new Vector(0, config.tileSize)],
  [Direction.Left, new Vector(-config.tileSize, 0)],
  [Direction.Right, new Vector(config.tileSize, 0)]
])