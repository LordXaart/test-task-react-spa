<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Database\DatabaseManager;
use Ramsey\Uuid\Uuid;

class SeedQuotes extends Command
{
    private const INSERT_RECORDS = 5000;
    private const QUOTES_TABLE = 'quotes';
    protected $signature = 'seed:quotes {count=1000000}';
    public function __invoke(DatabaseManager $db)
    {
        $count = (int) $this->argument('count');
        $steps = ceil($count / self::INSERT_RECORDS);
        $start = time();
        $this->info(sprintf('Start inserting %s records in %s steps', number_format($count), $steps));

        for ($step = 1; $step <= $steps; $step++) {
            $data = [];
            $count_records = $step < $steps ? self::INSERT_RECORDS : $count % self::INSERT_RECORDS;
            if (!$count_records) {
                continue;
            }

            for ($i = 0; $i < $count_records; $i++) {
                $data[] = [
                    'id' => Uuid::uuid4()->toString(),
                    'min' => rand(1000, 10000),
                    'max' => rand(1000, 10000),
                    'mean' => rand(1000, 10000),
                    'mode' => rand(1000, 10000),
                    'std' => rand(1000, 10000),
                    'count_missed' => rand(0, 10),
                    'count_quotes' => 10000,
                    'calculate_time' => rand(1, 1000) / 1000,
                    'calculate_started_at' => date('Y-m-d H:i:s', $start + $i),
                    'created_at' => date('Y-m-d H:i:s', $start + $i),
                ];
            }

            $db->table(self::QUOTES_TABLE)->insert($data);

            $this->info(sprintf('Step %s. Insert %s', $step, count($data)));
        }
    }
}
