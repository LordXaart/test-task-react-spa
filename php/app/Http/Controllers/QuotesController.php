<?php

namespace App\Http\Controllers;

use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class QuotesController extends Controller
{
    private const QUOTES_TABLE = 'quotes';

    public function index(Request $request, DatabaseManager $db)
    {
        $limit = $request->query('limit');

        $data = $db
            ->table(self::QUOTES_TABLE)
            ->orderBy('')
            ->limit($limit)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                ];
            });

        return (new Response())->setContent($data)->setStatusCode(200);
    }

    public function store(Request $request, ConnectionInterface $db)
    {
        $request->validate(['']);

        $data = $request->all(['']);

        $db->table(self::QUOTES_TABLE)->insert([$data]);

        return (new Response())->setContent($data)->setStatusCode(201);
    }

}
