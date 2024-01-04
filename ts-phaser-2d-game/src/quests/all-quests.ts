import { QUEST_1 } from './quests/quest-1';

export const ALL_QUESTS = [QUEST_1];

export const getQuest = ({ uid }: { uid: string }) => {
    const quest = ALL_QUESTS.find((q) => q.uid === uid);
    if (!quest) {
        throw new Error('Qest not found');
    }
    return quest;
};
