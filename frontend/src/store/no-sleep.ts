import {ref} from 'vue'
import {defineStore} from 'pinia'
import NoSleep from 'nosleep.js'

const noSleepTool = new NoSleep()

const useNoSleepStore = defineStore('noSleep', () => {
    const isNoSleepEnabled = ref<boolean>()

    const enableNoSleep = () => {
        noSleepTool.enable().then(() => {
            isNoSleepEnabled.value = noSleepTool.isEnabled
        }).catch(e => {
            console.log(e)
            isNoSleepEnabled.value = noSleepTool.isEnabled
        })
    }

    const disableNoSleep = () => {
        noSleepTool.disable()
        isNoSleepEnabled.value = noSleepTool.isEnabled
    }

    const toggleNoSleep = () => {
        if (noSleepTool.isEnabled) {
            disableNoSleep()
        } else {
            enableNoSleep()
        }
    }

    return {
        isNoSleepEnabled,
        enableNoSleep,
        disableNoSleep,
        toggleNoSleep
    }
})

export default useNoSleepStore