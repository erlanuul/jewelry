import {getCookie, setCookie} from 'typescript-cookie';
import axios from 'axios';
import {logout} from '../store/slices/userSlice';
import {dispatch} from '../index';
import {jwtDecode} from "jwt-decode";

export const API_URL = 'http://134.209.96.140:8000/api';
export const access_token_name = 'jewelery_access_token_v2';
export const refresh_token_name = 'jewelery_refresh_token_v2';

export const access_token = getCookie(access_token_name);
export const refresh_token = getCookie(refresh_token_name);

export const $axios = axios.create({
    withCredentials: false,
    baseURL: API_URL,
});

$axios.interceptors.request.use(
    async (config) => {
        if (access_token && refresh_token) {
            config.headers.Authorization = `JWT ${access_token}`;
            if (
                (config.url?.includes('/clients/') && config.method === 'post') ||
                (config.url?.includes('/clients/') && config.method === 'patch') ||
                (config.url?.includes('/clients/') && config.method === 'put') ||
                (config.url?.includes('/products/') && config.method === 'post') ||
                (config.url?.includes('/products/update/') && config.method === 'patch') ||
                (config.url?.includes('/products/update/') && config.method === 'put')
            ) {
                config.headers["Content-Type"] = 'multipart/form-data'
            } else {
                config.headers["Content-Type"] = 'application/json'
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

$axios.interceptors.response.use(
    (config) => config,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !error.config.url?.includes('/token/') && error.config && !originalRequest._isRetry) {
            originalRequest._isRetry = true;
            await refreshAccessToken()
            return $axios.request(originalRequest);
        } else {
            return Promise.reject(error);
        }
    }
);

const refreshAccessToken = () => {
    axios.post(`${API_URL}/token/refresh/`, JSON.stringify({refresh: refresh_token}),
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    ).then((response) => {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const accessDecode: any = jwtDecode(response.data.access);
        const accessExpirationInSeconds = accessDecode.exp;
        const accessDifferenceInSeconds = accessExpirationInSeconds - currentTimeInSeconds;
        const accessDifferenceInDays = Math.ceil(accessDifferenceInSeconds / (60 * 60 * 24));

        setCookie(access_token_name, response.data.access, {
            expires: accessDifferenceInDays,
        });
        window.location.reload()
    }).catch(() => {
        dispatch(logout())
    })
}
