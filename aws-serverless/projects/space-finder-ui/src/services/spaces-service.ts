import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AuthService } from './auth-service';
import { AWS_REGION } from '../common/config';
import { DataStack, ApiStack } from '../../cdk-outputs.json';
import { Space } from '../definitions/interfaces';

const SPACES_URL = ApiStack.SpacesApiEndpoint + 'spaces';

export class SpacesService {
    private authService: AuthService;
    private s3Client: S3Client | undefined;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async createSpace(name: string, location: string, photo?: File): Promise<string> {
        const photoUrl = photo ? await this.uploadSpacePhoto(photo) : undefined;
        const spaceData = {
            name: name,
            location: location,
            photoUrl: photoUrl,
        };
        const res = await fetch(SPACES_URL, {
            method: 'POST',
            body: JSON.stringify(spaceData),
            headers: {
                Authorization: this.authService.getJwt()!,
            },
        });
        const spaceId = await res.json();
        return spaceId;
    }

    private async uploadSpacePhoto(photo: File) {
        const credentials = await this.authService.getTemporaryCredentials();
        if (!this.s3Client) {
            this.s3Client = new S3Client({
                credentials: credentials as undefined,
                region: AWS_REGION,
            });
        }
        const command = new PutObjectCommand({
            Bucket: DataStack.SpaceFinderPhotosBucketName,
            Key: photo.name,
            ACL: 'public-read',
            Body: photo,
        });
        await this.s3Client.send(command);
        return `https://${command.input.Bucket}.s3.${AWS_REGION}.amazonaws.com/${command.input.Key}`;
    }

    public async readSpaces(): Promise<Space[]> {
        const res = await fetch(SPACES_URL, {
            method: 'GET',
            headers: {
                Authorization: this.authService.getJwt()!,
            },
        });
        const spaces = await res.json();
        return spaces;
    }
}
