type BattleComponentProps = {
    onEndBattle: () => void;
};

export const BattleComponent = ({ onEndBattle }: BattleComponentProps) => {
    return (
        <>
            <h2>Battle Started</h2>
            <button onClick={() => onEndBattle()}>Run</button>
        </>
    );
};
