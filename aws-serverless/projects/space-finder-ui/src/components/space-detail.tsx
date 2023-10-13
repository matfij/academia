import { Space } from '../definitions/interfaces';

const DEFAULT_SPACE_PHOTO = 'space.jpg';

type SpaceDetailProps = {
    space: Space;
    reserveSpace: (spaceId: string, spaceName: string) => void;
};

export default function SpaceDetail({ space }: SpaceDetailProps) {
    const renderPhoto = () => {
        if (space.photoUrl) {
            return <img src={space.photoUrl} alt="space photo" className="spacePhoto" />;
        } else {
            return <img src={DEFAULT_SPACE_PHOTO} alt="space photo" className="spacePhoto" />;
        }
    };
    return (
        <section>
            {renderPhoto()}
            <p>{space.name}</p>
            <p>{space.location}</p>
        </section>
    );
}
