<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () {
    return 'Quotes Exchange';
});

$router->get('/quotes', 'QuotesController@index');
$router->post('/quotes', 'QuotesController@store');
