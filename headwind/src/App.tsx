import './App.css';
import { WorldComponent } from './world/WorldComponent';

export const App = () => {
    return (
        <main className="appWrapper">
            <h1>Headwind</h1>
            <WorldComponent />
        </main>
    );
};
