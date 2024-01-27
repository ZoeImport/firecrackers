import axios from './axios.ts'
import EventDispatcher from '../utils/event-dispatcher.ts'
import {
    HttpResponseBody,
    SocketServerSendPack,
    SocketServerSendPlayerGameDataPack,
    PlayerGameData,
    PlayerDto
} from '../model.ts'
import {CancelToken} from 'axios'

const join = (playerId: string | null, cancelToken?: CancelToken) => {
    return axios.post<HttpResponseBody<string>>('/api/room/join', {playerId}, {cancelToken})
}

const getPlayers = () => {
    return axios.post<HttpResponseBody<Array<PlayerDto>>>('/api/room/getPlayers')
}

const removePlayer = (playerId: string) => {
    return axios.post<HttpResponseBody<void>>('/api/room/removePlayer', {playerId})
}

const sortPlayers = (playerIds: Array<string>) => {
    return axios.post<HttpResponseBody<void>>('/api/room/sortPlayers', {playerIds})
}

const resetPlayerNumbers = () => {
    return axios.post<HttpResponseBody<void>>('/api/room/resetPlayerNumbers')
}

const igniteStrands = () => {
    return axios.post<HttpResponseBody<void>>('/api/room/igniteStrands')
}

const resetStrands = () => {
    return axios.post<HttpResponseBody<void>>('/api/room/resetStrands')
}

type SocketStatus = 'initial' | 'connecting' | 'connected' | 'disconnecting' | 'disconnected'

class Socket {
    private props: { playerId: string }
    private status: SocketStatus
    private webSocket: WebSocket | null
    private statusChangeEventDispatcher: EventDispatcher<SocketStatus>
    private receiveGameDataEventDispatcher: EventDispatcher<PlayerGameData>

    constructor(playerId: string) {
        this.props = {
            playerId
        }
        this.status = 'initial'
        this.webSocket = null
        this.statusChangeEventDispatcher = new EventDispatcher<SocketStatus>()
        this.receiveGameDataEventDispatcher = new EventDispatcher<PlayerGameData>()
    }

    connect() {
        if (this.status === 'initial') {
            this.status = 'connecting'
            this.statusChangeEventDispatcher.dispatchEvent(this.status)
            try {
                this.webSocket = new WebSocket('ws://' + location.hostname + ':' + location.port + '/api/socket?playerId=' + encodeURIComponent(this.props.playerId))
            } catch (e) {
                console.log(e)
            }
            if (this.webSocket) {
                this.webSocket.addEventListener('open', () => {
                    if (this.status === 'connecting') {
                        this.status = 'connected'
                        this.statusChangeEventDispatcher.dispatchEvent(this.status)
                    }
                })
                this.webSocket.addEventListener('close', () => {
                    this.status = 'disconnected'
                    this.statusChangeEventDispatcher.dispatchEvent(this.status)
                })
                this.webSocket.addEventListener('error', (e) => {
                    console.log(e)
                })
                this.webSocket.addEventListener('message', (e) => {
                    if (this.status === 'connected') {
                        const pack = JSON.parse(e.data) as SocketServerSendPack<any>
                        if (pack.type === 'playerGameData') {
                            this.receiveGameDataEventDispatcher.dispatchEvent((pack as SocketServerSendPlayerGameDataPack).data)
                        }
                    }
                })
            } else {
                this.status = 'disconnected'
                this.statusChangeEventDispatcher.dispatchEvent(this.status)
            }
        }
    }

    disconnect() {
        if (this.status === 'connecting' || this.status === 'connected') {
            this.status = 'disconnecting'
            this.statusChangeEventDispatcher.dispatchEvent(this.status)
            this.webSocket?.close()
        }
    }

    addStatusChangeEventListener(listener: (e: SocketStatus) => void) {
        this.statusChangeEventDispatcher.addListener(listener)
    }

    removeStatusChangeListener(listener: (e: SocketStatus) => void) {
        this.statusChangeEventDispatcher.removeListener(listener)
    }

    addReceivePlayerGameDataListener(listener: (e: PlayerGameData) => void) {
        this.receiveGameDataEventDispatcher.addListener(listener)
    }

    removeReceivePlayerGameDataListener(listener: (e: PlayerGameData) => void) {
        this.receiveGameDataEventDispatcher.removeListener(listener)
    }

    getStatus(): SocketStatus {
        return this.status
    }
}

export {
    join,
    getPlayers,
    removePlayer,
    sortPlayers,
    resetPlayerNumbers,
    igniteStrands,
    resetStrands,
    Socket
}

export type {
    SocketStatus
}