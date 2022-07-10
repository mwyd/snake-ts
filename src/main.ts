import config, { DEBUG_MODE, toggleDebug } from './config'
import Game from './modules/Game'
import DebugLogger from './modules/loggers/DebugLogger'
import NullLogger from './modules/loggers/NullLogger'

import './style.css'

const game = new Game(config)
game.start()

window.addEventListener('keydown', (e) => {
  if (e.key == 'g') {
    toggleDebug()

    game.setLogger(!DEBUG_MODE ? new NullLogger() : new DebugLogger())
  }
})