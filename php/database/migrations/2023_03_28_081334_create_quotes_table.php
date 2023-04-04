<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->engine = 'MyISAM';
            $table->uuid('id')->primary();
            $table->unsignedInteger('min');
            $table->unsignedInteger('max');
            $table->unsignedInteger('mode');
            $table->unsignedInteger('mean');
            $table->unsignedInteger('std');
            $table->unsignedInteger('count_missed');
            $table->unsignedInteger('count_quotes');
            $table->unsignedFloat('calculate_time', 6, 4);
            $table->timestamp('calculate_started_at');
            $table->timestamp('created_at')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
