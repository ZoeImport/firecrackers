package xyz.dreamagician.electronicfirecrackers.model;

public class StrandStatusDto {
    private boolean ignited;
    private boolean finished;
    private Long igniteTime;
    private Long duration;

    public boolean isIgnited() {
        return ignited;
    }

    public void setIgnited(boolean ignited) {
        this.ignited = ignited;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public Long getIgniteTime() {
        return igniteTime;
    }

    public void setIgniteTime(Long igniteTime) {
        this.igniteTime = igniteTime;
    }

    public Long getDuration() {
        return duration;
    }

    public void setDuration(Long duration) {
        this.duration = duration;
    }
}
