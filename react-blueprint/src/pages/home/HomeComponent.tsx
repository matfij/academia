import { Suspense } from 'react';
import { ItemListComponent } from './ItemListComponent';
import { LoadingComponent } from '../../common/components/LoadingComponent';
import { ErrorBoundary } from '../../common/components/ErrorBoundaryComponent';
import { ErrorComponent } from '../../common/components/ErrorComponent';

export const HomeComponent = () => {
    return (
        <>
            <h2>Home Component</h2>
            <hr />
            <ErrorBoundary fallback={<ErrorComponent />}>
                <Suspense fallback={<LoadingComponent />}>
                    <ItemListComponent />
                </Suspense>
            </ErrorBoundary>
        </>
    );
};
