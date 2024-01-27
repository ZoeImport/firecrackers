<template>
  <ui-menu @player-manage-click="showPlayersManageDialog = true" @click="onMenuClick"/>
  <el-dialog title="玩家管理" append-to-body v-model="showPlayersManageDialog" style="width: 500px;max-width: 100%"
             destroy-on-close>
    <players-manage/>
  </el-dialog>
  <el-dialog title="分享" append-to-body style="width: 300px; max-width: 100%" v-model="showShareDialog">
    <share/>
  </el-dialog>
  <el-dialog title="连接已断开" append-to-body style="width: 300px; max-width: 100%" v-model="showReconnectDialog"
             :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-button @click="reconnect">重新连接</el-button>
  </el-dialog>
  <el-dialog title="登陆" append-to-body style="width: 300px; max-width: 100%" v-model="showLoginDialog"
             :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <login/>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {ElLoading} from 'element-plus'
import uiMenu from './menu.vue'
import PlayersManage from './players-manage.vue'
import Share from './share.vue'
import Login from './login.vue'
import useAuthenticationStore from '../store/authentication.ts'
import useRoomStore from '../store/room.ts'
import {resetStrands as apiResetStrands} from '../api/room.ts'
import LoadingController from '../utils/loading-controller.ts'
import firecrackerBoomAudio from '../assets/firecracker-boom.mp3'

const authenticationStore = useAuthenticationStore()
const {authenticated} = storeToRefs(authenticationStore)
const roomStore = useRoomStore()
const {connectionStatus} = storeToRefs(roomStore)

const showPlayersManageDialog = ref(false)
const showShareDialog = ref(false)
const showReconnectDialog = ref(false)
const showLoginDialog = ref(false)

const testAudioPlayer = new Audio()
testAudioPlayer.src = firecrackerBoomAudio

const onMenuClick = (name: string) => {
  switch (name) {
    case 'audioTest':
      testAudioPlayer.currentTime = 0
      testAudioPlayer.play()
      break
    case 'playerManage':
      showPlayersManageDialog.value = true
      break
    case 'resetStrands':
      apiResetStrands()
      break
    case 'share':
      showShareDialog.value = true
  }
}

const reconnect = () => {
  roomStore.connect()
}

watch(connectionStatus, (value) => {
  if (value === 'unconnected') {
    showPlayersManageDialog.value = false
    showShareDialog.value = false
    showReconnectDialog.value = authenticated.value;
  } else if (value === 'connected') {
    showReconnectDialog.value = false
  }
})

watch(authenticated, (value) => {
  if (value) {
    showLoginDialog.value = false
  } else {
    showPlayersManageDialog.value = false
    showShareDialog.value = false
    showReconnectDialog.value = false
    showLoginDialog.value = true
  }
})

let elLoading: { close: () => void } | null = null
const loadingController = new LoadingController(500)
const loading = loadingController.getLoading()
loadingController.when(() => connectionStatus.value === 'connecting')
watch(loading, (value) => {
  if (value) {
    if (elLoading === null) {
      elLoading = ElLoading.service({
        text: '正在连接'
      })
    }
  } else {
    if (elLoading !== null) {
      elLoading.close()
      elLoading = null
    }
  }
}, {
  immediate: true
})
</script>

<style scoped>
</style>