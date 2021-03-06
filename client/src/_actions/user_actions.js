import axios from 'axios';

import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
} from './types';
import { USER_SERVER } from '../components/Config.js';
const headers = { 'Content-Type': 'application/json' };

export default function GetMovieSources(movieId){
    
    return axios.get(`/api/movies/${movieId}`,
    {
        withCredentials: true,
        headers: headers
    })
}

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}
export function confirmation(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/confirmation`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}
export function sendResetMail(email){
    return axios.post(`${USER_SERVER}/forgotPassword`,{email},
    { headers: headers }
    )
}
export function resetPassword(tokenConf, password, password_confirm, username){
    
    return axios.post(`${USER_SERVER}/reset/${tokenConf}`,
        {tokenConf, password, password_confirm, username},
        { headers: headers }
    )
}

export function activeAccount(tokenConf){
    return axios.get(`${USER_SERVER}/confirmation/${tokenConf}`,
    { headers: headers } 
    )
}


export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_SERVER}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_SERVER}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_SERVER}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

