package xyz.dreamagician.electronicfirecrackers.game;

import org.springframework.util.Assert;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;

public class Player {
    private final String id;
    private int number;
    private final StrandStatus strandStatus;
    private volatile WebSocketSession session;

    public Player(String id, int number) {
        Assert.notNull(id, "id cant not be null");
        this.id = id;
        this.number = number;
        strandStatus = new StrandStatus();
        session = null;
    }

    public String getId() {
        return id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public StrandStatus getStrandStatus() {
        return strandStatus;
    }

    public synchronized void connect(WebSocketSession session) throws IOException {
        if (this.session != null) {
            this.session.close();
        }
        this.session = session;
    }

    public synchronized void disconnect() throws IOException {
        if (session != null) {
            session.close();
            session = null;
        }
    }

    public boolean isConnected() {
        WebSocketSession session = this.session;
        return session != null && session.isOpen();
    }

    public void sendMessage(String message) throws IOException {
        WebSocketSession session = this.session;
        if (session != null && session.isOpen()) {
            session.sendMessage(new TextMessage(message));
        }
    }
}
