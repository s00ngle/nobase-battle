
sudo docker build -t node .

sudo docker stop front
sudo docker rm front
sudo docker run -d -p 3000:3000 --env-file=.env --name front node
