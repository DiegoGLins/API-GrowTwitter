export interface CreateUserDto {
    avatar?: string
    name: string;
    username: string;
    email: string;
    password: string
}

export interface UpdateUserDto {
    id?: string;
    name?: string;
    avatar?: string;
    username?: string;
    email?: string;
    password?: string;
    token?: string | null
}
