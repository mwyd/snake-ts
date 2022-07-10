import Config from './modules/interfaces/Config'

let DEBUG_MODE = false

const toggleDebug = () => {
  DEBUG_MODE = !DEBUG_MODE
}

const config: Config = {
  tileSize: 30,
  initLength: 3,
  tickrate: 10,
  snakeColor: 'green',
  fruitColor: 'red',
  boostColor: 'yellow',
  boostTimeout: 4 * 1000,
  reverseColor: 'purple',
  boardColor: 'white'
}

export default config

export {
  DEBUG_MODE,
  toggleDebug
}