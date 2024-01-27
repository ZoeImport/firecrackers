package xyz.dreamagician.electronicfirecrackers.model;

public class PlayerGameData {
    private long timeStamp;
    private PlayerDto player;
    private StrandType strandType;
    private StrandStatusDto strandStatus;

    public long getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(long timeStamp) {
        this.timeStamp = timeStamp;
    }

    public PlayerDto getPlayer() {
        return player;
    }

    public void setPlayer(PlayerDto player) {
        this.player = player;
    }

    public StrandType getStrandType() {
        return strandType;
    }

    public void setStrandType(StrandType strandType) {
        this.strandType = strandType;
    }

    public StrandStatusDto getStrandStatus() {
        return strandStatus;
    }

    public void setStrandStatus(StrandStatusDto strandStatus) {
        this.strandStatus = strandStatus;
    }
}
