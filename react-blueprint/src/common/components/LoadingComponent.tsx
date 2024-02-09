import style from './LoadingComponent.module.scss';

export const LoadingComponent = () => {
    return (
        <div className={style.loadingWrapper}>
            <div className={style.loadingItem}></div>
        </div>
    );
};
