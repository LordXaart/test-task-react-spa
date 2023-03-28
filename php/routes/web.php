<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\QuotesController;

$router->get('/', function () {
    return 'Quotes Exchange';
});

$router->get('/api/quotes', 'QuotesController@index');
$router->post('/api/quotes', [QuotesController::class, 'store']);
