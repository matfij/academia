import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { ItemListComponent } from '../itemList/ItemListComponent';
import { ROUTES } from '../../common/routes';
import { ItemAddComponent } from '../itemAdd/ItemAddComponent';

export const HomeComponent = () => {
    const navigate = useNavigate();

    return (
        <>
            <main>
                <Outlet />
            </main>
            <nav>
                <button onClick={() => navigate(ROUTES.ITEM_LIST)}>My Items</button>
                <button onClick={() => navigate(ROUTES.ITEM_ADD)}>Add Items</button>
            </nav>
        </>
    );
};
