export class SpacesService {
    async createSpace(name: string, location: string, photo?: File): Promise<string> {
        return `${name}-${location}-${photo?.size}`;
    }
}
