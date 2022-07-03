docker images prune
docker rmi -f $(docker images --filter "dangling=true" -q --no-trunc)
