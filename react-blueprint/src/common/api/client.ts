import axios from 'axios';
import { ItemsApi, UsersApi } from './generated';
import { StorageService } from '../services/StorageService';
import { ToastService } from '../services/ToastService';

const BASE_PATH = 'http://localhost:3013';

type ApiError = {
    name: string;
    code: string;
    message: string;
}

axios.interceptors.request.use((req) => {
    const authToken = StorageService.get('user')?.accessToken;
    req.headers['Authorization'] = `Bearer ${authToken}`;
    return req;
});

axios.interceptors.response.use(
    (res) => res,
    (err: ApiError) => {
        console.log('errno!')
        ToastService.error({ text: err.message });
        return Promise.reject(err);
    },
);

export const UsersClient = new UsersApi(undefined, BASE_PATH, axios);
export const ItemsClient = new ItemsApi(undefined, BASE_PATH, axios);
