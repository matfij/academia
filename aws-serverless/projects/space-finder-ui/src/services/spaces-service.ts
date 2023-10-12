import { AuthService } from './auth-service';

export class SpacesService {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async createSpace(name: string, location: string, photo?: File): Promise<string> {
        const credentials = await this.authService.getTemporaryCredentials();
        console.log(credentials);
        return `${name}-${location}-${photo?.size}`;
    }
}
