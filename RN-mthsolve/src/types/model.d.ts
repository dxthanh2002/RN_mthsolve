// data types


export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string | string[];
        statusCode: number | string;
        data?: T;
    }

    interface IRegister {
        _id: string;
    }

    interface IUserLogin {
        user: {
            email: string;
            _id: string;
            name: string;
            role: string;
            address: any;
            avatar: string;
            phone: string;
        }
        access_token: string;
    }

    interface FormData {
        append(name: string, value: { uri: string; type: string; name: string }, fileName?: string): void;
    }

}
