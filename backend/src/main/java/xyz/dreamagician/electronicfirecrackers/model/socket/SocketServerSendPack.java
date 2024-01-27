package xyz.dreamagician.electronicfirecrackers.model.socket;

public class SocketServerSendPack<T> {
    private SocketServerSendPackType type;
    private T data;

    protected SocketServerSendPack(SocketServerSendPackType type, T data) {
        this.type = type;
        this.data = data;
    }

    public SocketServerSendPackType getType() {
        return type;
    }

    public T getData() {
        return data;
    }
}
