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
        Schema::create('flashcards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('deck_id');
            $table->text('front_text');
            $table->text('back_text');
            $table->string('image_url')->nullable();
            $table->string('audio_url')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            // Set foreign key
            $table->foreign('deck_id')->references('id')->on('decks')->onUpdate('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flashcards');
    }
};
