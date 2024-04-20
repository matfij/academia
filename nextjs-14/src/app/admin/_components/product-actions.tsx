'use client';

import { useTransition } from 'react';
import { DropdownMenuItem } from '../../../shared/components/shadcn/dropdown-menu';
import { deleteProduct, toggleProductAvailability } from '../_actions/product-actions';
import { useRouter } from 'next/navigation';

export function ProductActionActivateComponent({ id, isAvailable }: { id: string; isAvailable: boolean }) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <DropdownMenuItem
            onClick={() => {
                startTransition(async () => {
                    await toggleProductAvailability({ id, isAvailable: !isAvailable });
                    router.refresh();
                });
            }}
            disabled={pending}>
            {isAvailable ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
    );
}

export function ProductActionDeleteComponent({ id, disabled }: { id: string; disabled: boolean }) {
    const [pending, startTransition] = useTransition();
    const router = useRouter();

    return (
        <DropdownMenuItem
            onClick={() => {
                startTransition(async () => {
                    await deleteProduct({ id });
                    router.refresh();
                });
            }}
            disabled={pending || disabled}>
            <p className="text-destructive">Delete</p>
        </DropdownMenuItem>
    );
}
