import { ALL_ENEMEIS } from '../enemies/all-enemies';
import { Point } from '../shared/types';
import { ALL_QUESTS, getQuest } from './all-quests';
import { QuestStepItemProgress, QuestStepKillProgress } from './types';

export class QuestManager {
    private static questProgress: {
        questUid: string;
        questStep: number;
        killsProgress: QuestStepKillProgress[];
        itemsProgress: QuestStepItemProgress[];
    }[] = [];

    public static getQuestsForMap({ mapUid }: { mapUid: string }) {
        const quests: { questUid: string; position: Point }[] = [];
        // ongoing quests
        const progress = [...this.questProgress];
        progress.forEach((progress) => {
            const quest = getQuest({ uid: progress.questUid });
            const currentStepLocation = quest.steps[progress.questStep].location;
            if (currentStepLocation.mapUid === mapUid) {
                quests.push({ questUid: quest.uid, position: currentStepLocation.position });
            }
        });
        // available quests
        const mapQuests = ALL_QUESTS.filter((q) => q.startLocation.mapUid === mapUid);
        mapQuests.forEach((quest) => {
            if (!quests.map((q) => q.questUid).includes(quest.uid)) {
                quests.push({ questUid: quest.uid, position: quest.startLocation.position });
            }
        });
        return quests;
    }

    public static getQuestStatus({ questUid }: { questUid: string }) {
        // quest data & progress
        const quest = getQuest({ uid: questUid });
        const progress = this.questProgress.find((q) => q.questUid === questUid) ?? {
            questUid: questUid,
            questStep: 0,
            killsProgress: quest.steps[0].killsRequired.map((k) => ({ enemyUid: k.enemyUid, amount: 0 })),
            itemsProgress: quest.steps[0].killsRequired.map((i) => ({ itemUid: i.enemyUid, amount: 0 })),
        };
        // general message
        let status = quest.steps[progress.questStep].message;
        // kills-related progress
        quest.steps[progress.questStep].killsRequired.forEach((killRequired) => {
            const enemy = ALL_ENEMEIS.find((e) => e.uid === killRequired.enemyUid);
            const enemyKillsProgress = progress.killsProgress.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )?.amount;
            const enemyKillsRequired = quest.steps[progress.questStep].killsRequired.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )?.amount;
            status += `\nKill ${enemy?.name} ${enemyKillsProgress}/${enemyKillsRequired}`;
        });
        // TODO - same for items
        return {
            status,
        };
    }

    public static updateKillQuestProgress({ enemyUid, amount }: { enemyUid: string; amount: number }) {
        this.questProgress.forEach((progress) => {
            const quest = ALL_QUESTS.find((q) => q.uid === progress.questUid);
            if (!quest) {
                throw new Error('Quest not found!');
            }
            if (quest.steps[progress.questStep].killsRequired.map((k) => k.enemyUid === enemyUid)) {
                const currentProgress = progress.killsProgress.find((kp) => kp.enemyUid === enemyUid);
                if (currentProgress) {
                    currentProgress.amount += amount;
                } else {
                    progress.killsProgress.push({ enemyUid, amount });
                }
            }
        });
    }
}
