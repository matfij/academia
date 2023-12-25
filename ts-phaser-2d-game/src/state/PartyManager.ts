export class PartyManager {
    private static allies: { id: string }[] = [{ id: 'player-1' }, { id: 'player-2' }];

    public static getParty() {
        return this.allies;
    }
}
