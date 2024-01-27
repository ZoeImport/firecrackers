package xyz.dreamagician.electronicfirecrackers;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoginRequiredFilter implements Filter {
    private final ApplicationProperties applicationProperties;

    public LoginRequiredFilter(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if (applicationProperties.isLoginRequired()) {
            if (servletRequest instanceof HttpServletRequest httpServletRequest && servletResponse instanceof HttpServletResponse httpServletResponse) {
                if (servletRequest.getDispatcherType() == DispatcherType.REQUEST) {
                    String path = httpServletRequest.getServletPath();
                    if (path.startsWith("/api/") && !"/api/authentication/login".equals(path) && !"/api/authentication/logout".equals(path)) {
                        String username = (String) httpServletRequest.getSession().getAttribute("username");
                        if (username == null || username.isEmpty()) {
                            httpServletResponse.sendError(HttpStatus.UNAUTHORIZED.value());
                            return;
                        }
                    }
                }
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }
}
