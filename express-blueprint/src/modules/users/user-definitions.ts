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

export type UserCreateDto = {
    login: string;
    password: string;
};

export type UserLoginDto = {
    login: string;
    password: string;
}