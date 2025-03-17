<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MyClass extends Model
{
    protected $fillable = ['id', 'name', 'author_id', 'student_quantity'];
    protected $table = 'classes';
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_classes', 'class_id', 'user_id');
    }
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    public function folders()
    {
        return $this->belongsToMany(Folder::class, 'class_folders', 'class_id', 'folder_id');
    }
    public function decks()
    {
        return $this->belongsToMany(Deck::class, 'class_decks', 'class_id', 'deck_id');
    }
}
