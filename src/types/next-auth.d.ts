// we are re-configuring the 'User' and 'Session' interfcae inside next-auth
import 'next-auth'

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session{
        user: {
            id?: string;
            isVerified?: boolean; 
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}