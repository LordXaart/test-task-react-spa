<?php

namespace App\Http\Controllers;

use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\DatabaseManager;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Ramsey\Uuid\Uuid;

class QuotesController extends Controller
{
    private const QUOTES_TABLE = 'quotes';

    public function index(Request $request, DatabaseManager $db)
    {
        $limit = $request->query('limit');
        $limit = $limit <= 100 ? $limit : 100;

        $data = $db
            ->table(self::QUOTES_TABLE)
            ->orderBy('created_at', 'DESC')
            ->limit($limit)->get()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'min' => $item->min,
                    'max' => $item->max,
                    'mode' => $item->mode,
                    'mean' => $item->mean,
                    'std' => $item->std,
                    'count_missed' => $item->count_missed,
                    'count_quotes' => $item->count_quotes,
                    'calculate_time' => $item->calculate_time,
                    'calculate_started_at' => (new \DateTime($item->calculate_started_at))->format('Y-m-d H:i:s'),
                    'created_at' => $item->created_at,
                ];
            });

        return (new Response())->setContent($data)->setStatusCode(200);
    }

    public function store(Request $request, DatabaseManager $db)
    {
        $this->validate($request, [
            'min' => 'required|numeric',
            'max' => 'required|numeric',
            'mean' => 'required|numeric',
            'mode' => 'required|numeric',
            'std' => 'required|numeric',
            'countMissed' => 'required|numeric',
            'countQuotes' => 'required|numeric',
            'calculateTime' => 'required|numeric',
            'calculateStartedAt' => 'required|numeric',
        ]);

        $insert = [
            'id' => Uuid::uuid4()->toString(),
            'min' => (int) $request->input('min'),
            'max' => (int) $request->input('max'),
            'mean' => (int) $request->input('mean'),
            'mode' => (int) $request->input('mode'),
            'std' => (int) $request->input('std'),
            'count_missed' => (int) $request->input('countMissed'),
            'count_quotes' => (int) $request->input('countQuotes'),
            'calculate_time' => round($request->input('calculateTime'), 4),
            'calculate_started_at' => date('Y-m-d H:i:s',
                $request->input('calculateStartedAt')),
            'created_at' => date('Y-m-d H:i:s'),
        ];

        $db->table(self::QUOTES_TABLE)->insert([$insert]);

        return (new Response())->setContent($insert)->setStatusCode(201);
    }
}
