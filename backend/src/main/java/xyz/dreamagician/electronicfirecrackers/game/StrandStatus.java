package xyz.dreamagician.electronicfirecrackers.game;

public class StrandStatus {
    private boolean ignited;
    private boolean finished;
    private Long igniteTime;
    private Long duration;

    public StrandStatus() {
        ignited = false;
        finished = false;
        igniteTime = null;
        duration = null;
    }

    public void ignite(long igniteTime, long duration) {
        if (!ignited) {
            ignited = true;
            this.igniteTime = igniteTime;
            this.duration = duration;
        }
    }

    public void finish() {
        if (ignited && !finished) {
            finished = true;
        }
    }

    public void reset() {
        ignited = false;
        finished = false;
        igniteTime = null;
        duration = null;
    }

    public boolean isIgnited() {
        return ignited;
    }

    public boolean isFinished() {
        return finished;
    }

    public Long getIgniteTime() {
        return igniteTime;
    }

    public Long getDuration() {
        return duration;
    }
}
