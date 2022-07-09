import Game from './modules/Game'

import './style.css'

const game = new Game({
  tileSize: 20,
  initLength: 3,
  tickrate: 10
})

game.start()