package xyz.dreamagician.electronicfirecrackers.model.socket;

import xyz.dreamagician.electronicfirecrackers.model.PlayerGameData;

public class SocketServerSendPlayerGameDataPack extends SocketServerSendPack<PlayerGameData> {
    public SocketServerSendPlayerGameDataPack(PlayerGameData data) {
        super(SocketServerSendPackType.playerGameData, data);
    }
}
