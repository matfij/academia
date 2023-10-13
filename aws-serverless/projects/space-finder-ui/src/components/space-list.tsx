import { useEffect, useState } from 'react';
import { SpacesService } from '../services/spaces-service';
import { Space } from '../definitions/interfaces';
import SpaceDetail from './space-detail';

export type SpaceListProps = {
    spacesService: SpacesService;
};

export default function SpaceList({ spacesService }: SpaceListProps) {
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [reservationStatus, setReservationStatus] = useState<string>();

    useEffect(() => {
        (async () => {
            const spaces = await spacesService.readSpaces();
            setSpaces(spaces);
        })();
    }, []);

    const reserveSpace = (spaceId: string, spaceName: string) => {
        setReservationStatus('TODO - implement reserving');
    };

    return (
        <section>
            {spaces.map((space) => (
                <SpaceDetail key={space.id} space={space} reserveSpace={reserveSpace} />
            ))}
            {reservationStatus}
        </section>
    );
}
