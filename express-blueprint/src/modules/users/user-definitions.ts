export type User = {
    login: string;
    password: string;
    level: number;
};

export type UserCreateDto = {
    login: string;
    password: string;
};
