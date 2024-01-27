package xyz.dreamagician.electronicfirecrackers.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import xyz.dreamagician.electronicfirecrackers.model.response.Code;
import xyz.dreamagician.electronicfirecrackers.model.response.Message;
import xyz.dreamagician.electronicfirecrackers.model.response.MessageType;

import java.util.HashMap;
import java.util.Map;

@Controller
public class ErrorController extends BasicErrorController {
    @Autowired
    public ErrorController(ServerProperties serverProperties, ErrorAttributes errorAttributes, ObjectProvider<ErrorViewResolver> errorViewResolvers) {
        super(errorAttributes, serverProperties.getError(), errorViewResolvers.orderedStream().toList());
    }

    @Override
    public ResponseEntity<Map<String, Object>> error(HttpServletRequest request) {
        HttpStatus status = this.getStatus(request);
        if (status == HttpStatus.NO_CONTENT) {
            return new ResponseEntity<>(status);
        } else if (status == HttpStatus.UNAUTHORIZED) {
            Map<String, Object> body = new HashMap<>();
            body.put("code", Code.ERROR.getValue());
            body.put("message", new Message(MessageType.warning, "请先登录"));
            body.put("data", null);
            return new ResponseEntity<>(body, status);
        } else {
            Map<String, Object> body = new HashMap<>();
            body.put("code", Code.ERROR.getValue());
            body.put("message", new Message(MessageType.error, status.getReasonPhrase()));
            body.put("data", null);
            return new ResponseEntity<>(body, status);
        }
    }
}
