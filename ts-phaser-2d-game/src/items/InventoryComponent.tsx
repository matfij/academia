import { useEffect, useState } from 'react';
import style from './InventoryComponent.module.scss';
import { InventoryManager } from './InventoryManager';
import { DisplayItem } from './types';
import { TooltipComponent } from '../shared/TooltipComponent';

export const InventoryComponent = () => {
    const [items, setItems] = useState<DisplayItem[]>([]);

    useEffect(() => {
        setItems(InventoryManager.getItems());
    }, []);

    const getItemHint = (item: DisplayItem) => {
        return (
            <>
                <h2>{item.name}</h2>
                <p>Type: {item.type}</p>
                {item.statistics?.health && <p>Health: {item.statistics.health}</p>}
                {item.statistics?.mana && <p>Mana: {item.statistics.mana}</p>}
                {item.statistics?.damage && <p>Damage: {item.statistics.damage}</p>}
                {item.statistics?.armor && <p>Armor: {item.statistics.armor}</p>}
                {item.statistics?.speed && <p>Speed: {item.statistics.speed}</p>}
                {item.description && <p>{item.description}</p>}
                {item.quantity > 1 && <p>Quantity: {item.quantity}</p>}
            </>
        );
    };

    return (
        <main>
            <section className={style.inventoryWrapper}>
                <h3>Invenotry</h3>
                <div className={style.itemsWrapper}>
                    {items.map((item) => (
                        <TooltipComponent
                            key={item.id}
                            content={
                                <div className={style.itemItem}>
                                    <img src={`./images/${item.imageUrl}`} />
                                    <p>{item.name}</p>
                                </div>
                            }
                            hint={getItemHint(item)}
                            config={{ containerWidth: '100%' }}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};
