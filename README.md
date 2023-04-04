# test-task-react-spa

## Install local
```shell
# Run backend services
docker-compose up -d
docker-compose exec php composer install
docker-compose exec php artisan migrate
```

# Run SPA
```shell
cd react
yarn install
yarn start
```


## SQL
Написать sql запрос:
Дано 2 таблицы:
- работники (id, name) - содержит список работников;
- зарплаты (worker_id, date, value) - содержит список дат и суммы когда работники получали зарплаты
Необходимо написать запрос, который вернет список работников которые не получили з.п. за
указанный месяц.
Таблицы могут быть размером более миллиона записей.
```sql
SELECT w.id, w.name FROM `workers` w
LEFT JOIN (
    SELECT worker_id FROM salaries WHERE MONTH(date) = MONTH(NOW()) GROUP BY worker_id
) s ON w.id = s.worker_id
WHERE s.worker_id IS NULL;
```
