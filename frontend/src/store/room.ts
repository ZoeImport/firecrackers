import {ref} from 'vue'
import {defineStore} from 'pinia'
import {PlayerGameData} from '../model.ts'
import axios from '../api/axios.ts'
import {Socket, join as apiJoinRoom, SocketStatus} from '../api/room.ts'
import {CancelTokenSource} from 'axios'
import {CancelController} from '../utils/cancel-controller.ts'

const useRoomStore = defineStore('room', () => {
    const playerGameData = ref<PlayerGameData | null>(null)
    const connectionStatus = ref<ConnectionStatus>('unconnected')
    let socket: Socket | null = null

    const socketStatusChangeEventListener = (status: SocketStatus) => {
        if (status === 'connected') {
            connectionStatus.value = 'connected'
        } else if (status === 'disconnected') {
            playerGameData.value = null
            connectionStatus.value = 'unconnected'
        }
    }

    const socketReceivePlayerGameDataListener = (data: PlayerGameData) => {
        playerGameData.value = data
    }

    let cancelController: CancelController | null = null
    let cancelTokenSource: CancelTokenSource | null = null

    const connect = () => {
        cancelController?.cancel()
        cancelController = new CancelController()
        cancelTokenSource?.cancel()
        cancelTokenSource = axios.CancelToken.source()
        if (socket !== null) {
            socket.removeStatusChangeListener(socketStatusChangeEventListener)
            socket.removeReceivePlayerGameDataListener(socketReceivePlayerGameDataListener)
            socket.disconnect()
        }
        playerGameData.value = null
        connectionStatus.value = 'connecting'
        socket = null
        let playerId = localStorage.getItem('playerId')
        cancelController.exec(apiJoinRoom(playerId, cancelTokenSource.token), response => {
            cancelController = null
            cancelTokenSource = null
            if (response.data.code === 0) {
                playerId = response.data.data
                localStorage.setItem('playerId', playerId)
                socket = new Socket(playerId)
                socket.addStatusChangeEventListener(socketStatusChangeEventListener)
                socket.addReceivePlayerGameDataListener(socketReceivePlayerGameDataListener)
                socket.connect()
            } else {
                connectionStatus.value = 'unconnected'
            }
        }, () => {
            cancelController = null
            cancelTokenSource = null
            connectionStatus.value = 'unconnected'
        })
    }

    const disconnect = () => {
        cancelController?.cancel()
        cancelController = null
        cancelTokenSource?.cancel()
        cancelTokenSource = null
        if (socket !== null) {
            socket.removeStatusChangeListener(socketStatusChangeEventListener)
            socket.removeReceivePlayerGameDataListener(socketReceivePlayerGameDataListener)
            socket.disconnect()
        }
        playerGameData.value = null
        connectionStatus.value = 'unconnected'
        socket = null
    }

    return {
        playerGameData,
        connectionStatus,
        connect,
        disconnect
    }
})

type ConnectionStatus = 'unconnected' | 'connecting' | 'connected'

export default useRoomStore