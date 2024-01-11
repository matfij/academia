import { uuid } from '../shared/utils';
import { getItem } from './all-items';
import { UserItem } from './types';

export class InventoryManager {
    private static items: UserItem[] = [
        {
            id: uuid(),
            itemUid: 'item-c-1',
            quantity: 1,
        },
        {
            id: uuid(),
            itemUid: 'item-w-1',
            quantity: 1,
        },
        {
            id: uuid(),
            itemUid: 'item-a-1',
            quantity: 1,
        },
        {
            id: uuid(),
            itemUid: 'item-i-1',
            quantity: 4,
        },
        {
            id: uuid(),
            itemUid: 'item-con-1',
            quantity: 2,
        },
    ];

    public static getItems() {
        const items = this.items
            .filter((i) => i.quantity > 0)
            .map((item) => {
                const itemData = getItem({ uid: item.itemUid });
                return {
                    ...itemData,
                    id: item.id,
                    quantity: item.quantity,
                };
            });
        return [...items];
    }

    public static appendItem({ uid, quantity = 1 }: { uid: string; quantity?: number }) {
        const item = this.items.find((i) => i.itemUid === uid);
        // should all items be stackable?
        if (item) {
            item.quantity += quantity;
        } else {
            this.items.push({
                id: uuid(),
                itemUid: uid,
                quantity: quantity,
            });
        }
    }
}
