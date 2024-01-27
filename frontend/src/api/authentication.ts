import axios from './axios.ts'
import {HttpResponseBody} from '../model.ts'

const login = (username: string, password: string) => {
    return axios.post<HttpResponseBody<void>>('/api/authentication/login', {username, password}, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

const logout = () => {
    return axios.post<HttpResponseBody<void>>('/api/authentication/logout')
}

export {
    login,
    logout
}