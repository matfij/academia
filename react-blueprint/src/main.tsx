import './common/styles/index.scss';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomeComponent } from './pages/app/AppComponent.tsx';
import { NotFoundComponent } from './common/components/NotFoundComponent.tsx';
import { ToastContainer } from 'react-toastify';
import { ROUTES } from './common/routes.ts';
import { SigninComponent } from './pages/auth/SigninComponent.tsx';
import { SignupComponent } from './pages/auth/SignupComponent.tsx';
import { ItemListComponent } from './pages/itemList/ItemListComponent.tsx';
import { ItemAddComponent } from './pages/itemAdd/ItemAddComponent.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <div className="pageWrapper">
            <BrowserRouter>
                <Routes>
                    <Route path={ROUTES.ROOT} element={<SigninComponent />} />
                    <Route path={ROUTES.SIGNUP} element={<SignupComponent />} />
                    <Route path={ROUTES.APP} element={<HomeComponent />}>
                        <Route path={ROUTES.ITEM_LIST} element={<ItemListComponent />} />
                        <Route path={ROUTES.ITEM_ADD} element={<ItemAddComponent />} />
                        {/* <Route path="*" element={<ItemListComponent />} /> */}
                    </Route>
                    <Route path="*" element={<NotFoundComponent />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </div>
    </React.StrictMode>,
);
