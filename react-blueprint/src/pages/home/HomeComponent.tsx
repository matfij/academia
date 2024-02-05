import { useEffect, useState } from 'react';
import { ItemsClient } from '../../common/api/client';
import { ItemDto } from '../../common/api/generated';

export const HomeComponent = () => {
    const [items, setItems] = useState<ItemDto[]>([]);

    useEffect(() => {
        ItemsClient.readByUser().then((data) => setItems(data));
    }, [items]);

    return (
        <>
            <h2>Home Component</h2>
            <hr />
            <h3>My Items</h3>
            {items.map((item) => (
                <p>
                    {item.id} | {item.requiredLevel}
                </p>
            ))}
        </>
    );
};
