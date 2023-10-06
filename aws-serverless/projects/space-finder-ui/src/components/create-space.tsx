import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { SpacesService } from '../services/spaces-service';

type CreatespaceProps = {
    spacesService: SpacesService;
};

export default function CreateSpace({ spacesService }: CreatespaceProps) {
    const [name, setName] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [photo, _setPhoto] = useState<File | undefined>();
    const [actionResult, setActionResult] = useState<string>('');

    const handleSubmit = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (name && location) {
            const spaceId = await spacesService.createSpace(name, location, photo);
            setActionResult(`Space created (${spaceId}).`);
            setName('');
            setLocation('');
            return;
        }
        setActionResult('Name and Location required.');
    };

    const setPhoto = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files[0]) {
            return;
        }
        _setPhoto(event.target.files[0]);
    };

    const renderPhoto = () => {
        if (!photo) {
            return;
        }
        const photoUrl = URL.createObjectURL(photo);
        return <img src={photoUrl} alt="uploaded photo" />;
    };

    return (
        <section>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="name">Name:</label>
                <input type="text" onChange={(e) => setName(e.target.value)} />
                <label htmlFor="location">Location:</label>
                <input type="text" onChange={(e) => setLocation(e.target.value)} />
                <label htmlFor="photo">Photo:</label>
                <input type="file" onChange={(e) => setPhoto(e)} />
                {renderPhoto()}
                <button type="submit">Create</button>
                {actionResult}
            </form>
        </section>
    );
}
