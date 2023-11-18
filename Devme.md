## Docker commands

### Build

`docker build -t techfiesta .`

### Run

`docker run -p 3100:5000 your-image-name`

### List

`docker images`

### Delete container

`docker rm -f container_name`

### Authenticate kubernetes to docker

kubectl create secret docker-registry regcred --docker-server=https://index.docker.io/v1/ --docker-username=thellevid --docker-password=<your password> --docker-email=<your email address>
