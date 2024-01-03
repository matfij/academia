import { ALL_ENEMEIS } from '../enemies/all-enemies';
import { BattleEnemy } from '../enemies/types';
import { uuid } from '../shared/utils';
import { AdventureMap, Encounter } from './types';

export class EncounterManager {
    public static getEncounter({ map }: { map: AdventureMap }) {
        const groupSize = this.calculateGroupSize({ probabilities: map.groupSizeRate });
        const encounters: Encounter[] = [];
        for (let i = 0; i < groupSize; i++) {
            const randomIndex = this.getRandomIndexBasedOnRate({ encounters: map.encounters });
            encounters.push({ ...map.encounters[randomIndex] });
        }
        const enemies: BattleEnemy[] = encounters.map((encounter) => {
            const enemy = ALL_ENEMEIS.find((e) => e.uid === encounter.enemyUid) || ALL_ENEMEIS[0];
            return {
                id: uuid(),
                ...enemy,
            };
        });
        return enemies;
    }

    private static calculateGroupSize({ probabilities }: { probabilities: number[] }) {
        const cumulativeProbabilities = probabilities.reduce((acc, prob) => {
            acc.push(acc.length === 0 ? prob : acc[acc.length - 1] + prob);
            return acc;
        }, [] as number[]);
        const randomValue = Math.random();
        let groupSize = 0;
        for (let i = 0; i < cumulativeProbabilities.length; i++) {
            if (randomValue < cumulativeProbabilities[i]) {
                groupSize = i;
                break;
            }
        }
        return groupSize;
    }

    private static getRandomIndexBasedOnRate({ encounters }: { encounters: Encounter[] }) {
        const totalChance = encounters.reduce((sum, enemy) => sum + enemy.rate, 0);
        let randomValue = Math.random() * totalChance;
        for (let i = 0; i < encounters.length; i++) {
            randomValue -= encounters[i].rate;
            if (randomValue <= 0) {
                return i;
            }
        }
        return encounters.length - 1;
    }
}
