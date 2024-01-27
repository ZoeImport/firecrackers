package xyz.dreamagician.electronicfirecrackers.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import xyz.dreamagician.electronicfirecrackers.game.Room;

import java.util.Map;

@Component
public class GameWebSocketHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(GameWebSocketHandler.class);
    private final Room room;

    @Autowired
    public GameWebSocketHandler(Room room) {
        this.room = room;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Map<String, Object> attributes = session.getAttributes();
        if (!room.connect((String) attributes.get("playerId"), session)) {
            attributes.put("connectionRefused", true);
            session.close();
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Map<String, Object> attributes = session.getAttributes();
        if (!Boolean.TRUE.equals(attributes.get("connectionRefused"))) {
            room.disconnect((String) attributes.get("playerId"));
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error(exception.getMessage(), exception);
    }
}
