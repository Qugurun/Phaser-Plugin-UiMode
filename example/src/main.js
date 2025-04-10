
import UiMode from './UIMode';

import SpinePlugin from '@esotericsoftware/spine-phaser';
import Boot from './scenes/Boot';
import Game from './scenes/Game';
import GameUi from './scenes/GameUi';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 1136,
    parent: 'game-container',
    backgroundColor: '#000000',

    plugins: {
        global: [{
            key: 'UiMode',
            plugin: UiMode,
            start: true
        }],
        scene: [
            {
                key: "spine.SpinePlugin",
                plugin: spine.SpinePlugin,
                mapping: "spine",
            }
        ]
    },

    scene: [
        Boot,
        Game, GameUi
    ]
};

export default new Phaser.Game(config);
