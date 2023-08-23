CMS_POD=$(docker ps -qf "name=oky-en_cms")
docker exec -it $CMS_POD yarn run migrate-up
