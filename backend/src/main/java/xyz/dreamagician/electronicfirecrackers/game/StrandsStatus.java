package xyz.dreamagician.electronicfirecrackers.game;

public class StrandsStatus {
    private boolean ignited;
    private boolean finished;
    private Integer currentIndex;

    public StrandsStatus() {
        ignited = false;
        finished = false;
        currentIndex = null;
    }

    public void ignite() {
        if (!ignited) {
            ignited = true;
            this.currentIndex = -1;
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
        currentIndex = null;
    }

    public void next() {
        if (ignited && !finished) {
            currentIndex++;
        }
    }

    public boolean isIgnited() {
        return ignited;
    }

    public boolean isFinished() {
        return finished;
    }

    public Integer getCurrentIndex() {
        return currentIndex;
    }
}
