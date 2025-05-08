FROM openjdk:17-jdk-slim

ENV SPRING_PROFILES_ACTIVE=prod

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["java", "-jar", "/app.jar", "-Duser.timezone=Asia/Seoul"]
