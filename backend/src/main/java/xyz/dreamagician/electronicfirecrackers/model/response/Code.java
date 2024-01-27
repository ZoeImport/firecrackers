package xyz.dreamagician.electronicfirecrackers.model.response;

public enum Code {
    OK(0),
    UNAUTHORIZED(-1001),
    AUTHORIZE_FAILED(-1002),
    ERROR(-10000);

    int value;

    Code(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
