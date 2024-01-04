import { ALL_ENEMEIS } from '../enemies/all-enemies';
import { Point } from '../shared/types';
import { ALL_QUESTS, getQuest } from './all-quests';
import { QuestState, QuestStepItemProgress, QuestStepKillProgress } from './types';

export class QuestManager {
    private static questProgress: {
        questUid: string;
        questState: QuestState;
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

    public static getQuestDescription({ questUid }: { questUid: string }) {
        // quest data & progress
        const quest = getQuest({ uid: questUid });
        const progress = this.questProgress.find((q) => q.questUid === questUid) ?? {
            questUid: questUid,
            questStep: 0,
            questState: QuestState.NotStarted, // TODO - handle locked quests
            killsProgress: quest.steps[0].killsRequired.map((k) => ({ enemyUid: k.enemyUid, amount: 0 })),
            itemsProgress: quest.steps[0].killsRequired.map((i) => ({ itemUid: i.enemyUid, amount: 0 })),
        };
        // general message
        let description = `<h2>${quest.name}</h2><p>${quest.steps[progress.questStep].message}</p>`;
        // kills-related progress
        quest.steps[progress.questStep].killsRequired.forEach((killRequired) => {
            const enemy = ALL_ENEMEIS.find((e) => e.uid === killRequired.enemyUid);
            const enemyKillsProgress = progress.killsProgress.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )?.amount;
            const enemyKillsRequired = quest.steps[progress.questStep].killsRequired.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )?.amount;
            description += `<li>Slay ${enemy?.name} ${enemyKillsProgress}/${enemyKillsRequired}</li>`;
        });
        // TODO - same for items
        return {
            description,
            state: progress.questState,
        };
    }

    public static startQuest({ questUid }: { questUid: string }) {
        if (this.questProgress.map((qp) => qp.questUid).includes(questUid)) {
            throw new Error('Quest aleready started');
        }
        const quest = getQuest({ uid: questUid });
        this.questProgress.push({
            questUid: quest.uid,
            questStep: 0,
            questState: QuestState.Started,
            killsProgress: quest.steps[0].killsRequired.map((k) => ({ enemyUid: k.enemyUid, amount: 0 })),
            itemsProgress: quest.steps[0].itemsRequired.map((i) => ({ itemUid: i.itemUid, amount: 0 })),
        });
    }

    public static proceedQuest({ questUid }: { questUid: string }) {
        const progress = this.questProgress.find((qp) => qp.questUid === questUid);
        if (!progress) {
            throw new Error('Invalid operation!');
        }
        let requirementsMissing = false;
        const quest = getQuest({ uid: progress.questUid });
        quest.steps[progress.questStep].killsRequired.forEach((killRequired) => {
            const enemyKillsProgress = progress.killsProgress.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )!.amount;
            const enemyKillsRequired = quest.steps[progress.questStep].killsRequired.find(
                (kp) => kp.enemyUid === killRequired.enemyUid,
            )!.amount;
            if (enemyKillsProgress < enemyKillsRequired) {
                requirementsMissing = true;
            }
        });
        // TODO - check missing items
        if (requirementsMissing) {
            throw new Error('Requirements missing!');
        }
        progress.questStep += 1;
        progress.killsProgress = quest.steps[progress.questStep].killsRequired.map((k) => ({ enemyUid: k.enemyUid, amount: 0 }));
        progress.itemsProgress = quest.steps[progress.questStep].itemsRequired.map((i) => ({ itemUid: i.itemUid, amount: 0 }));
        if (quest.steps.length - 1 === progress.questStep) {
            progress.questState = QuestState.Completed;
        }
        const newDescription = this.getQuestDescription({ questUid });
        return newDescription;
    }

    public static updateKillQuestProgress({ enemyUid, amount }: { enemyUid: string; amount: number }) {
        this.questProgress.forEach((progress) => {
            const quest = getQuest({ uid: progress.questUid });
            const killRequirement = quest.steps[progress.questStep].killsRequired.find((k) => k.enemyUid === enemyUid);
            if (killRequirement) {
                const currentProgress = progress.killsProgress.find((kp) => kp.enemyUid === enemyUid);
                if (currentProgress) {
                    currentProgress.amount += amount;
                    currentProgress.amount = Math.min(currentProgress.amount, killRequirement.amount);
                } else {
                    progress.killsProgress.push({ enemyUid, amount });
                }
            }
        });
    }
}
