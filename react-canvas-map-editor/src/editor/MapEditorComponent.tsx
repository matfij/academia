import { useState, useRef, useEffect, MouseEvent } from 'react';
import { TileType } from './types';
import { MapManager } from './MapManager';

const TILE_SIZE = 10;
const ROWS = 60;
const COLUMNS = 110;

export const MapEditorComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [blueprint, setBlueprint] = useState('');
    const [tileType, setTileType] = useState(TileType.Route);
    const [map, setMap] = useState(MapManager.createEmptyMap(ROWS, COLUMNS));
    const [isPainting, setIsPainting] = useState(false);
    const [cursorSize, setCursorSize] = useState(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        drawMap(ctx!, map);
    }, [map]);

    const drawMap = (ctx: CanvasRenderingContext2D, map: TileType[][]) => {
        ctx.clearRect(0, 0, canvasRef!.current!.width, canvasRef!.current!.height);
        map.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                ctx.fillStyle = getTileColor(tile);
                ctx.fillRect(colIndex * TILE_SIZE, rowIndex * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            });
        });
    };

    const getTileColor = (type: TileType) => {
        switch (type) {
            case TileType.Wall:
                return '#808080';
            case TileType.Passage:
                return '#7cb9e8';
            case TileType.Quest:
                return '#ffff00';
            case TileType.Boss:
                return '#ff7f7f';
            case TileType.Route:
            default:
                return '#66ff99';
        }
    };

    const handleCanvasClick = (e: MouseEvent) => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const mouseX = e.clientX - rect!.left;
        const mouseY = e.clientY - rect!.top;
        const col = Math.floor(mouseX / TILE_SIZE);
        const row = Math.floor(mouseY / TILE_SIZE);
        paintTiles(row, col);
    };

    const paintTiles = (row: number, col: number) => {
        const updatedMap = [...map];
        const halfCursorSize = Math.floor(cursorSize / 2);
        for (let i = -halfCursorSize; i <= halfCursorSize; i++) {
            for (let j = -halfCursorSize; j <= halfCursorSize; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < ROWS && newCol >= 0 && newCol < COLUMNS) {
                    updatedMap[newRow][newCol] = tileType;
                }
            }
        }
        setMap(updatedMap);
    };

    const printMap = () => {
        const printedMap = MapManager.printMap(map, TILE_SIZE);
        navigator.clipboard.writeText(printedMap);
    };

    return (
        <div className="mainWrapper">
            <div className="canvasWrapper">
                <canvas
                    ref={canvasRef}
                    width={COLUMNS * TILE_SIZE}
                    height={ROWS * TILE_SIZE}
                    style={{ border: '1px solid black' }}
                    onClick={handleCanvasClick}
                    onMouseDown={() => setIsPainting(true)}
                    onMouseUp={() => setIsPainting(false)}
                    onMouseMove={(e) => {
                        if (isPainting) handleCanvasClick(e);
                    }}
                />
            </div>
            <div className="blueprintWrapper">{blueprint && <img src={blueprint} />}</div>
            <div className="actionWrapper">
                <div onClick={() => setTileType(TileType.Route)} className="actionItem green">
                    ∎ Route
                </div>
                <div onClick={() => setTileType(TileType.Wall)} className="actionItem gray">
                    ∎ Wall
                </div>
                <div onClick={() => setTileType(TileType.Passage)} className="actionItem blue">
                    ∎ Passage
                </div>
                <div onClick={() => setTileType(TileType.Quest)} className="actionItem yellow">
                    ∎ Quest
                </div>
                <div onClick={() => setTileType(TileType.Boss)} className="actionItem red">
                    ∎ Boss
                </div>
            </div>
            <div className="rangeWrapper">
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if (file) setBlueprint(URL.createObjectURL(file));
                        }}
                    />
                </div>
                <label>Cursor Size:</label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={cursorSize}
                    onChange={(e) => setCursorSize(parseInt(e.target.value, 10))}
                />
                <div onClick={() => printMap()} className="printButton">
                    Print
                </div>
            </div>
        </div>
    );
};
