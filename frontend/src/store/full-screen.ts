import {ref} from 'vue'
import {defineStore} from 'pinia'
import pinia from './index.ts'

const useFullScreenStore = defineStore('fullScreen', () => {
    const isFullscreen = ref<boolean>()

    const fetchFullScreen = () => {
        if (document.fullscreenEnabled) {
            isFullscreen.value = !!document.fullscreenElement
        } else {
            isFullscreen.value = false
        }
    }

    const requestFullScreen = () => {
        if (document.fullscreenEnabled) {
            document.documentElement.requestFullscreen().then(() => {
                fetchFullScreen()
            }).catch(e => {
                console.log(e)
                fetchFullScreen()
            })
        }
    }

    const exitFullScreen = () => {
        if (document.fullscreenEnabled) {
            document.exitFullscreen().then(() => {
                fetchFullScreen()
            }).catch(e => {
                console.log(e)
                fetchFullScreen()
            })
        }
    }

    const toggleFullScreen = () => {
        fetchFullScreen()
        if (isFullscreen.value) {
            exitFullScreen()
        } else {
            requestFullScreen()
        }
    }

    return {
        isFullscreen,
        fetchFullScreen,
        requestFullScreen,
        exitFullScreen,
        toggleFullScreen
    }
})


const fullScreenStore = useFullScreenStore(pinia)
document.addEventListener('fullscreenchange', () => {
    fullScreenStore.fetchFullScreen()
})

export default useFullScreenStore