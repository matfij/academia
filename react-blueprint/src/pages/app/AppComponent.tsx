import style from './AppComponent.module.scss';
import { Outlet, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../common/config';
import { StorageService } from '../../common/services/StorageService';

export const HomeComponent = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        StorageService.clear();
        navigate(ROUTES.ROOT);
    };

    return (
        <>
            <main className={style.mainWrapper}>
                <Outlet />
            </main>
            <nav className={style.navWrapper}>
                <button onClick={() => navigate(ROUTES.CHAT)}>Chat</button>
                <button onClick={() => navigate(ROUTES.ITEM_LIST)}>My Items</button>
                <button onClick={() => navigate(ROUTES.ITEM_ADD)}>Add Item</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </>
    );
};
