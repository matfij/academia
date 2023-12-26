import { Ally } from '../shared/types';

export class PartyManager {
    private static allies: Ally[] = [
        { id: 'player-1', name: 'Gengar II', attacks: [{ name: 'Sword Swing' }, { name: 'Swallow Blade' }] },
        {
            id: 'player-2',
            name: 'Astrolfo',
            attacks: [{ name: 'Lance Strike' }, { name: 'Bolt of Bahamut' }],
        },
    ];

    public static getParty() {
        return this.allies;
    }
}
