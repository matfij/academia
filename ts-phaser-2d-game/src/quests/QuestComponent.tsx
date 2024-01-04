import { useState } from 'react';
import { createMarkup } from '../shared/utils';
import style from './QuestComponent.module.scss';
import { QuestManager } from './QuestManager';
import { QuestState } from './types';

type QuestComponentProps = {
    questUid: string;
    questDescription: string;
    questState: QuestState;
    onHideQuest: () => void;
};

export const QuestComponent = ({ questUid, questDescription, questState, onHideQuest }: QuestComponentProps) => {
    const [description, setDescription] = useState(questDescription);
    const [state, setState] = useState(questState);

    const start = () => {
        QuestManager.startQuest({ questUid });
        // TODO - show status toast
        onHideQuest();
    };

    const proceed = () => {
        const questData = QuestManager.proceedQuest({ questUid });
        setDescription(questData.description);
        setState(questData.state);
    };

    return (
        <section className={style.questWrapper}>
            <div className={style.descriptionWrapper} dangerouslySetInnerHTML={createMarkup(description)} />
            <hr />
            <div className={style.buttonsWrapper}>
                <button onClick={() => onHideQuest()} className={style.questButton}>
                    Close
                </button>
                {state !== QuestState.Locked && state !== QuestState.Completed && (
                    <button
                        onClick={() => (state === QuestState.NotStarted ? start() : proceed())}
                        className={style.questButton}
                    >
                        {state === QuestState.NotStarted ? 'Accept' : 'Proceed'}
                    </button>
                )}
            </div>
        </section>
    );
};
