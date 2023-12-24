import { useEffect, useRef } from 'react';
import { WorldManager } from './WorldManager';
import { PlayerManager } from '../player/PlayerManager';

export const WorldComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        WorldManager.createApp({ canvas: canvasRef.current || undefined });
        WorldManager.loadWorldMap({ texturePath: './images/map.png' }).then(() => {
            PlayerManager.loadPlayer({ x: 50, y: 90 });
        });
    }, []);

    return <canvas ref={canvasRef} />;
};
