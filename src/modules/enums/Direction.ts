import Vector from '../Vector'

enum Direction {
  Up = 'w',
  Down = 's',
  Left = 'a',
  Right = 'd'
}

export default Direction

export const useDirections = (tileSize: number): Map<Direction, Vector> => new Map([
  [Direction.Up, new Vector(0, -tileSize)],
  [Direction.Down, new Vector(0, tileSize)],
  [Direction.Left, new Vector(-tileSize, 0)],
  [Direction.Right, new Vector(tileSize, 0)]
])