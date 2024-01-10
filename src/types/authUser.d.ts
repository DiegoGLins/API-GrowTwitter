declare namespace Express {
    interface Request {
        authUser: {
            id: string,
            name: string,
            username: string,
            avatar: string,
            email: string,
        };
    }
}