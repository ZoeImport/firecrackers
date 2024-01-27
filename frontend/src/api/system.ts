import axios from './axios.ts'
import {HttpResponseBody} from '../model.ts'

const shutdown = () => {
    return axios.post<HttpResponseBody<void>>('/api/system/shutdown')
}

const getUrls = () => {
    return axios.post<HttpResponseBody<Array<string>>>('/api/system/getUrls')
}

export {
    shutdown,
    getUrls
}