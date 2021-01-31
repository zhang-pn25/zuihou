#!/bin/bash
cur_dir=`pwd`

docker stop zuihou_ui
docker rm zuihou_ui
docker run --name zuihou_ui --restart=always \
    -p 11180:80 \
	  -e DOCKER_REQUEST_DOMAIN_PREFIX=http://42.202.130.216:10000 \
    -e NGINX_HOST=localhost \
    -e TZ=Asia/Shanghai \
    -d zuihou-ui:latest

# 启动项目时， 请将：DOCKER_REQUEST_DOMAIN_PREFIX替换成自己的后端服务(不能用127.0.0.1和localhost)。 NGINX_HOST替换成nginx服务器的IP或者域名
