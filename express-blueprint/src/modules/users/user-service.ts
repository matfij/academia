import { ApiError } from '../../common/api-error';
import { UserCreateDto } from './user-definitions';
import { UserModel } from './user-schema';

export class UserService {
    private static UserModel = UserModel;

    public static async createUser(dto: UserCreateDto) {
        const existingUser = await this.UserModel.find({ login: dto.login });
        if (existingUser) {
            throw new ApiError({ message: 'errors.loginInUse' });
        }
        
    }

    
}
