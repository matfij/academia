import { useEffect, useState } from 'react';
import { ItemDto, ItemStatistics } from '../../common/api/generated';
import { ItemsClient } from '../../common/api/client';

export const ItemListComponent = () => {
    const [items, setItems] = useState<ItemDto[]>([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const res = await ItemsClient.readByUser();
        setItems(res.data);
    };

    const displayStatistics = (statistics: ItemStatistics) => {
        return (
            <>
                <p>{statistics.agility}</p>
                <p>{statistics.intelligence}</p>
                <p>{statistics.strength}</p>
            </>
        );
    };

    return (
        <section>
            <h3>Inventory</h3>
            {items.map((item) => (
                <li key={item.id}>
                    {item.requiredLevel} | {displayStatistics(item.statistics)}
                </li>
            ))}
        </section>
    );
};
