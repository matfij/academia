import axios from 'axios';
import { ItemsApi, UsersApi } from './generated';
import { StorageService } from '../services/StorageService';

const BASE_PATH = 'http://localhost:3013';

axios.interceptors.request.use((config) => {
    const authToken = StorageService.get('user')?.accessToken;
    config.headers['Authorization'] = `Bearer ${authToken}`;
    return config;
});

// TODO - add response interceptor for error handling

export const UsersClient = new UsersApi(undefined, BASE_PATH, axios);
export const ItemsClient = new ItemsApi(undefined, BASE_PATH, axios);
