package xyz.dreamagician.electronicfirecrackers.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.dreamagician.electronicfirecrackers.ApplicationProperties;
import xyz.dreamagician.electronicfirecrackers.model.response.Code;
import xyz.dreamagician.electronicfirecrackers.model.response.HttpResponseBody;
import xyz.dreamagician.electronicfirecrackers.model.response.Message;
import xyz.dreamagician.electronicfirecrackers.model.response.MessageType;

@RestController
@RequestMapping("/api/authentication")
public class AuthenticationController {
    private final ApplicationProperties applicationProperties;

    @Autowired
    public AuthenticationController(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @PostMapping("login")
    public HttpResponseBody<Void> login(String username, String password, HttpSession session) {
        if (username == null || username.isEmpty()) {
            return new HttpResponseBody<>(Code.AUTHORIZE_FAILED.getValue(), new Message(MessageType.warning, "用户名不能为空"), null);
        }
        if (password == null || password.isEmpty()) {
            return new HttpResponseBody<>(Code.AUTHORIZE_FAILED.getValue(), new Message(MessageType.warning, "密码不能为空"), null);
        }
        if (username.equals(applicationProperties.getUsername()) && password.equals(applicationProperties.getPassword())) {
            session.setAttribute("username", username);
            return HttpResponseBody.ok();
        } else {
            return new HttpResponseBody<>(Code.AUTHORIZE_FAILED.getValue(), new Message(MessageType.warning, "用户名或密码错误"), null);
        }
    }

    @PostMapping("logout")
    public HttpResponseBody<Void> logout(HttpSession session) {
        session.removeAttribute("username");
        return HttpResponseBody.ok();
    }
}
