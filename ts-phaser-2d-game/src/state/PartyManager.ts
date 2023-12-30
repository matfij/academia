import { Character } from '../shared/types';

export class PartyManager {
    private static allies: Character[] = [
        {
            id: 'player-1',
            name: 'Gengar II',
            baseStatistics: {
                speed: 100,
                health: 100,
            },
            moves: [
                { id: 'move-4', name: 'Sword Swing', damage: 10 },
                { id: 'move-5', name: 'Swallow Blade', damage: 30 },
            ],
        },
        // {
        //     id: 'player-2',
        //     name: 'Astrolfo',
        //     baseStatistics: {
        //         speed: 225,
        //         health: 1800,
        //     },
        //     moves: [
        //         { id: 'move-1', name: 'Lance Strike', damage: 10 },
        //         { id: 'move-2', name: 'Wind Thrust', damage: 45 },
        //         { id: 'move-3', name: 'Bolt of Bahamut', damage: 120 },
        //     ],
        // },
    ];

    public static getParty() {
        return this.allies;
    }
}
