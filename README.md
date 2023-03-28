# test-task-react-spa

## Install local
```shell
# Run backend services
docker-compose up -d
docker-compose exec php composer install
docker-compose exec php artisan migrate
```

```shell
cd react
yarn install
yarn start # run spa
```
