FROM openjdk:17-jdk-slim

ENV SPRING_PROFILES_ACTIVE=prod

ARG JAR_FILE=build/libs/nobasebattle-0.0.1-SNAPSHOT.jar app.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["/bin/sh", "-c", "source /app/.env && exec java -jar /app.jar -Duser.timezone=Asia/Seoul"]
