import {ref} from 'vue'
import {defineStore} from 'pinia'
import {login as apiLogin, logout as apiLogout} from '../api/authentication.ts'

const useAuthenticationStore = defineStore('authentication', () => {
    const authenticated = ref(true)
    const setAuthenticated = (value: boolean) => {
        authenticated.value = value
    }

    const login = (username: string, password: string) => {
        return new Promise<void>((resolve, reject) => {
            apiLogin(username, password).then(response => {
                if (response.data.code === 0) {
                    authenticated.value = true
                    resolve()
                } else {
                    reject(response)
                }
            }, e => {
                reject(e)
            })
        })
    }

    const logout = () => {
        return new Promise<void>((resolve, reject) => {
            apiLogout().then(response => {
                if (response.data.code === 0) {
                    authenticated.value = false
                    resolve()
                } else {
                    reject(response)
                }
            }, e => {
                reject(e)
            })
        })
    }

    return {
        authenticated,
        setAuthenticated,
        login,
        logout
    }
})

export default useAuthenticationStore