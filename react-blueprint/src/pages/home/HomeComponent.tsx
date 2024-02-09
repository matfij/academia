import { Suspense } from 'react';
import { ItemListComponent } from './ItemListComponent';
import { LoadingComponent } from '../../common/components/LoadingComponent';

export const HomeComponent = () => {
    return (
        <>
            <h2>Home Component</h2>
            <hr />
            <Suspense fallback={<LoadingComponent />}>
                <ItemListComponent />
            </Suspense>
        </>
    );
};
