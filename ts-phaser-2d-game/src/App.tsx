import { useEffect } from 'react';
import './App.css';
import Phaser from 'phaser';
import { WorldScene } from './scenes/WorldScene';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: WorldScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true,
        },
    },
};
const game = new Phaser.Game(config);

export const App = () => {
    useEffect(() => {}, []);
    return <></>;
};
