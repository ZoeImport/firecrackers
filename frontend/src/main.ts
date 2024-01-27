import {createApp} from 'vue'
import App from './App.vue'
import pinia from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import useRoomStore from './store/room.ts'

createApp(App).use(pinia).use(ElementPlus).mount('#app')

const roomStore = useRoomStore(pinia)
roomStore.connect()