package xyz.dreamagician.electronicfirecrackers.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.web.context.WebServerGracefulShutdownLifecycle;
import org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext;
import org.springframework.context.ApplicationContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import xyz.dreamagician.electronicfirecrackers.ApplicationProperties;
import xyz.dreamagician.electronicfirecrackers.model.response.HttpResponseBody;

import java.net.*;
import java.util.*;

@RestController
@RequestMapping("api/system")
public class SystemController {
    private static final Logger logger = LoggerFactory.getLogger(SystemController.class);

    private final ApplicationContext applicationContext;
    private final ApplicationProperties applicationProperties;

    @Autowired
    public SystemController(ApplicationContext applicationContext, ApplicationProperties applicationProperties) {
        this.applicationContext = applicationContext;
        this.applicationProperties = applicationProperties;
    }

    @PostMapping("shutdown")
    public HttpResponseBody<Void> shutdown() {
        applicationContext.getBean(WebServerGracefulShutdownLifecycle.class).stop(() -> {
            System.exit(SpringApplication.exit(applicationContext));
        });
        return HttpResponseBody.ok();
    }

    @PostMapping("getUrls")
    public HttpResponseBody<List<String>> getUrls() {
        List<String> urls = applicationProperties.getUrls();
        if (urls == null || (urls.size() == 1 && urls.get(0).isEmpty())) {
            urls = Collections.emptyList();
        } else if (urls.size() == 1 && "auto".equals(urls.get(0))) {
            urls = new ArrayList<>();
            if (applicationContext instanceof ServletWebServerApplicationContext servletWebServerApplicationContext) {
                int port = servletWebServerApplicationContext.getWebServer().getPort();
                try {
                    List<InetAddress> inetAddresses = new ArrayList<>();
                    Enumeration<NetworkInterface> networkInterfaceEnumeration = NetworkInterface.getNetworkInterfaces();
                    while (networkInterfaceEnumeration.hasMoreElements()) {
                        NetworkInterface networkInterface = networkInterfaceEnumeration.nextElement();
                        if (!networkInterface.isLoopback()) {
                            for (InterfaceAddress interfaceAddress : networkInterface.getInterfaceAddresses()) {
                                inetAddresses.add(interfaceAddress.getAddress());
                            }
                        }
                    }
                    for (InetAddress inetAddress : inetAddresses) {
                        if (inetAddress instanceof Inet4Address inet4Address) {
                            urls.add("http://" + inet4Address.getHostAddress() + (port == 80 ? "" : ":" + port) + "/");
                        }
                    }
                    for (InetAddress inetAddress : inetAddresses) {
                        if (inetAddress instanceof Inet6Address inet6Address) {
                            urls.add("http://[" + inet6Address.getHostAddress().replaceAll("%.*", "") + "]" + (port == 80 ? "" : ":" + port) + "/");
                        }
                    }
                } catch (SocketException e) {
                    logger.warn(e.getMessage());
                }
            }
        }
        return HttpResponseBody.ok(urls);
    }
}
