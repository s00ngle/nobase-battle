./gradlew clean build -x test --no-daemon

docker stop nbb
docker rm nbb
docker image remove nobase

docker build -t nobase .

docker run -d --name nbb -e TZ=Asia/Seoul -p 8080:8080 nobase
