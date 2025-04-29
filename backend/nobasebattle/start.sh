./gradlew clean build -x test --no-daemon

docker stop nbb
docker rm nbb
docker image remove nobase

docker build -t nobase .

docker run -d --name nbb --env-file .env -e TZ=Asia/Seoul --network host nobase