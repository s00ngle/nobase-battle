FROM openjdk:17-jdk-slim

ENV SPRING_PROFILES_ACTIVE=prod

WORKDIR /app
RUN mkdir -p log && chmod 777 log

ARG JAR_FILE=build/libs/nobasebattle-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

ENTRYPOINT ["/bin/sh", "-c", 'exec java $(env | sed -E "s/(.*)=.*/-D\\1=${!1}/" | tr "\n" " ") -jar app.jar -Duser.timezone=Asia/Seoul']

