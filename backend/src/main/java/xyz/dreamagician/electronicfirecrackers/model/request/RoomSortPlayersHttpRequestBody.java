package xyz.dreamagician.electronicfirecrackers.model.request;

import java.util.List;

public class RoomSortPlayersHttpRequestBody {
    private List<String> playerIds;

    public List<String> getPlayerIds() {
        return playerIds;
    }

    public void setPlayerIds(List<String> playerIds) {
        this.playerIds = playerIds;
    }
}
