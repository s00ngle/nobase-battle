./gradlew clean build -x test --no-daemon

sudo docker stop nbb
sudo docker rm nbb
sudo docker image remove nobase

sudo docker build -t nobase .

sudo docker run -d --name nbb --env-file .env -e TZ=Asia/Seoul -p 8080:8080 --network test nobase
