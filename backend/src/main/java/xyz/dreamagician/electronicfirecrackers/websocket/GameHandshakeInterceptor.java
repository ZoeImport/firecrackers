package xyz.dreamagician.electronicfirecrackers.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import xyz.dreamagician.electronicfirecrackers.game.Room;

import java.util.Map;

@Component
public class GameHandshakeInterceptor implements HandshakeInterceptor {
    private final Room room;

    @Autowired
    public GameHandshakeInterceptor(Room room) {
        this.room = room;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest serverRequest) {
            String playerId = serverRequest.getServletRequest().getParameter("playerId");
            if (playerId != null && room.hasPlayer(playerId)) {
                attributes.put("playerId", playerId);
                return true;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}
