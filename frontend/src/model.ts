type StrandType = 'none' | 'single' | 'middle' | 'first' | 'last'

interface PlayerDto {
    id: string,
    number: number,
    connected: boolean
}

interface StrandStatusDto {
    ignited: boolean
    finished: boolean
    igniteTime: number
    duration: number
}

interface PlayerGameData {
    timeStamp: number
    player: PlayerDto
    strandType: StrandType
    strandStatus: StrandStatusDto
}

interface HttpResponseBody<T> {
    code: number,
    message: string | null
    data: T
}

type SocketServerSendDataPackType = 'playerGameData'

interface SocketServerSendPack<T> {
    type: SocketServerSendDataPackType,
    data: T
}

interface SocketServerSendPlayerGameDataPack extends SocketServerSendPack<PlayerGameData> {
    type: 'playerGameData'
}

export type {
    StrandType,
    PlayerDto,
    StrandStatusDto,
    PlayerGameData,
    HttpResponseBody,
    SocketServerSendPack,
    SocketServerSendPlayerGameDataPack
}