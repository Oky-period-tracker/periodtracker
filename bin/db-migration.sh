CMS_POD=$(docker ps -qf "name=cms")
docker exec -it $CMS_POD yarn ts-node ./node_modules/typeorm/cli.js migration:run
