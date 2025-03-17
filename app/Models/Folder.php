<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    protected $fillable = ['id', 'name', 'author_id'];
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function decks()
    {
        return $this->belongsToMany(Deck::class, 'deck_folders', 'folder_id', 'deck_id');
    }
    public function classes()
    {
        return $this->belongsToMany(MyClass::class, 'class_folders', 'class_id', 'folder_id');
    }
}
