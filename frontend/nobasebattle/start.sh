docker build -t node .

docker stop front
docker rm front
docker run -d -p 3000:3000 --name front node
