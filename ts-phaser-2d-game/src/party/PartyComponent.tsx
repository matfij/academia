import style from './PartyComponent.module.scss';
import { useEffect, useState } from 'react';
import { Ally } from './types';
import { PartyManager } from './PartyManager';
import { PARTY_INDEXES, PARTY_SIZE_MAX, PARTY_SIZE_MIN } from '../config';

export const PartyComponent = () => {
    const [party, setParty] = useState<Ally[]>([]);
    const [roster, setRoster] = useState<Ally[]>([]);

    useEffect(() => {
        setParty(PartyManager.getParty());
        setRoster(PartyManager.getRoster());
    }, []);

    const addToParty = (id: string) => {
        if (party.length >= PARTY_SIZE_MAX) {
            return;
        }
        PartyManager.addToParty({ allyUid: id });
        setParty(PartyManager.getParty());
        setRoster(PartyManager.getRoster());
    };

    const removeFromParty = (id: string) => {
        if (party.length <= PARTY_SIZE_MIN) {
            return;
        }
        PartyManager.removeFromParty({ allyUid: id });
        setParty(PartyManager.getParty());
        setRoster(PartyManager.getRoster());
    };

    const getAlly = (partyIndex: number) => {
        return party.find((a) => a.partyIndex === partyIndex);
    };

    return (
        <main>
            <section className={style.partyWrapper}>
                <h3>Team </h3>
                <div className={style.charactersWrapper}>
                    {PARTY_INDEXES.map((partyIndex) => {
                        const ally = getAlly(partyIndex);
                        return (
                            <div key={partyIndex} className={style.characterItem}>
                                {ally ? (
                                    <>
                                        <img src={`./images/${ally.uid}.png`} />
                                        <p>
                                            <b>{ally.name}</b> | <span className="action">👁️</span> |{' '}
                                            <span
                                                onClick={() => removeFromParty(ally.uid)}
                                                className="action"
                                            >
                                                ➖
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <span className={style.placeholderTitle}>➕</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <hr />
                <h3>Available Allies</h3>
                <div className={style.charactersWrapper}>
                    {roster.map((character) => (
                        <div key={character.id} className={style.characterItem}>
                            <img src={`./images/${character.uid}.png`} />
                            <p>
                                <b>{character.name}</b> | <span className="action">👁️</span> |{' '}
                                <span onClick={() => addToParty(character.uid)} className="action">
                                    ➕
                                </span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};
