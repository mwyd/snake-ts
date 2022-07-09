import config from './config'
import Game from './modules/Game'

import './style.css'

const game = new Game(config)

game.start()