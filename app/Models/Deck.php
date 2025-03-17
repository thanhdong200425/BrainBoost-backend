<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deck extends Model
{
    protected $fillable = ['id', 'name', 'description', 'author_id'];
    public function folders()
    {
        return $this->belongsToMany(Folder::class, 'deck_folders', 'deck_id', 'folder_id');
    }
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function classes()
    {
        return $this->belongsToMany(MyClass::class, 'class_decks', 'deck_id', 'class_id');
    }
}
