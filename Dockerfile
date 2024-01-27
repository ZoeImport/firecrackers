FROM openjdk:17
WORKDIR /electronic-firecrackers
COPY ./backend/target/electronic-firecrackers.jar electronic-firecrackers.jar
RUN echo -e "\
application:\n\
  login-required: \${APPLICATION_LOGIN_REQUIRED:false}\n\
  username: \${APPLICATION_USERNAME:username}\n\
  password: \${APPLICATION_PASSWORD:password}\n\
  urls: \${APPLICATION_URLS:}" > application.yml
EXPOSE 8080
CMD ["java", "-jar", "electronic-firecrackers.jar"]