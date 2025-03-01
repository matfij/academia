import { useState, useRef, useEffect, MouseEvent, ChangeEvent } from 'react';
import { SceneTileType } from './types';
import { MapManager } from './MapManager';

const TILE_SIZE = 10;
const ROWS = 75;
const COLUMNS = 145;

export const MapEditorComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mapImage, setMapImage] = useState('');
    const [tileType, setTileType] = useState(SceneTileType.SafeRoute);
    const [map, setMap] = useState(MapManager.createEmptyMap(ROWS, COLUMNS));
    const [isPainting, setIsPainting] = useState(false);
    const [cursorSize, setCursorSize] = useState(1);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        drawMap(ctx!, map);
    }, [map]);

    const handleMapImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (!file) {
            return;
        }
        setMapImage(URL.createObjectURL(file));
    };

    const drawMap = (ctx: CanvasRenderingContext2D, map: SceneTileType[][]) => {
        ctx.clearRect(0, 0, canvasRef!.current!.width, canvasRef!.current!.height);
        map.forEach((row, rowIndex) => {
            row.forEach((tile, colIndex) => {
                ctx.fillStyle = getTileColor(tile);
                ctx.fillRect(colIndex * TILE_SIZE, rowIndex * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            });
        });
    };

    const getTileColor = (type: SceneTileType) => {
        switch (type) {
            case SceneTileType.Collision:
                return '#808080';
            case SceneTileType.Passage:
                return '#7cb9e8';
            case SceneTileType.Quest:
                return '#ffff00';
            case SceneTileType.Encounter:
                return '#ff7f7f';
            case SceneTileType.Npc:
                return '#c43cbd';
            case SceneTileType.Route:
                return '#ab8821';
            case SceneTileType.Empty:
                return '#000';
            case SceneTileType.SafeRoute:
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
                <div className="mapImageWrapper">{mapImage && <img src={mapImage} />}</div>
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
            <div className="actionWrapper">
                <div onClick={() => setTileType(SceneTileType.SafeRoute)} className="actionItem green">
                    ∎ Safe Route
                </div>
                <div onClick={() => setTileType(SceneTileType.Route)} className="actionItem orange">
                    ∎ Route
                </div>
                <div onClick={() => setTileType(SceneTileType.Collision)} className="actionItem gray">
                    ∎ Wall
                </div>
                <div onClick={() => setTileType(SceneTileType.Passage)} className="actionItem blue">
                    ∎ Passage
                </div>
                <div onClick={() => setTileType(SceneTileType.Quest)} className="actionItem yellow">
                    ∎ Quest
                </div>
                <div onClick={() => setTileType(SceneTileType.Npc)} className="actionItem purple">
                    ∎ Npc
                </div>
                <div onClick={() => setTileType(SceneTileType.Encounter)} className="actionItem red">
                    ∎ Encounter
                </div>
                <div onClick={() => setTileType(SceneTileType.Empty)} className="actionItem black">
                    ∎ Empty
                </div>
            </div>
            <div className="rangeWrapper">
                <div>
                    <input type="file" accept="image/*" onChange={(e) => handleMapImageUpload(e)} />
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
