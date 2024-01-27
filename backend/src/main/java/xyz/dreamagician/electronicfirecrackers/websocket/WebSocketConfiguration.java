package xyz.dreamagician.electronicfirecrackers.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {
    private final GameWebSocketHandler gameWebSocketHandler;
    private final GameHandshakeInterceptor gameHandshakeInterceptor;

    @Autowired
    public WebSocketConfiguration(GameWebSocketHandler gameWebSocketHandler, GameHandshakeInterceptor gameHandshakeInterceptor) {
        this.gameWebSocketHandler = gameWebSocketHandler;
        this.gameHandshakeInterceptor = gameHandshakeInterceptor;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(gameWebSocketHandler, "/api/socket")
                .setAllowedOriginPatterns("*")
                .addInterceptors(gameHandshakeInterceptor);
    }
}
