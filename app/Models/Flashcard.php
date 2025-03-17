<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flashcard extends Model
{
    protected $fillable = ['id', 'deck_id', 'front_text', 'back_text', 'image_url', 'audio_url', 'description'];
    public function deck()
    {
        return $this->belongsTo(Deck::class, 'deck_id');
    }
}
