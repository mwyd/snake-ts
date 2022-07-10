import config, { toggleDebug } from './config'
import Game from './modules/Game'

import './style.css'

window.addEventListener('keydown', (e) => {
    if (e.key == 'g') {
        toggleDebug()
    }
})

const game = new Game(config)
game.start()