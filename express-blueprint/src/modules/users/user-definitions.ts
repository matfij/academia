export type User = {
    id: string;
    username: string;
    password: string;
    level: number;
};

export type UserDto = {
    id: string;
    username: string;
    level: number;
};

export type UserSignedDto = UserDto & {
    accessToken: string;
    refreshToken: string;
};

export type UserSignupDto = {
    username: string;
    password: string;
};

export type UserSigninDto = {
    username: string;
    password: string;
};
