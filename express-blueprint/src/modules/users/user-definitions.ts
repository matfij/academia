export type User = {
    id: string;
    login: string;
    password: string;
    level: number;
};

export type UserDto = {
    id: string;
    login: string;
    level: number;
};

export type UserAuthDto = UserDto & {
    accessToken: string;
    refreshToken: string;
};

export type UserSignupDto = {
    login: string;
    password: string;
};

export type UserSigninDto = UserSignupDto;
