import axios from 'axios'
import pinia from '../store/index.ts'
import useAuthenticationStore from '../store/authentication.ts'
import {ElMessage} from 'element-plus'

const authenticationStore = useAuthenticationStore(pinia)

axios.interceptors.response.use((response) => {
    const message = response.data?.message
    if (message && message.content) {
        if (message.type === 'info') {
            ElMessage.info(message.content)
        } else if (message.type === 'success') {
            ElMessage.success(message.content)
        } else if (message.type === 'warning') {
            ElMessage.warning(message.content)
        } else if (message.type === 'error') {
            ElMessage.error(message.content)
        }
    }
    return response
}, (error) => {
    const response = error.response
    if (response) {
        if (response.status === 401) {
            authenticationStore.setAuthenticated(false)
        }
        const message = response.data?.message
        if (message && message.content) {
            if (message.type === 'info') {
                ElMessage.info(message.content)
            } else if (message.type === 'success') {
                ElMessage.success(message.content)
            } else if (message.type === 'warning') {
                ElMessage.warning(message.content)
            } else if (message.type === 'error') {
                ElMessage.error(message.content)
            }
        }
    }
    return Promise.reject(error)
})

export default axios