<?php

namespace App\Models;

use Dom\Comment;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'thumbnail',
        'body',
        'status'
    ];
    protected $appends = ['image_url'];
    public function getImageUrlAttribute()
    {
        if ($this->thumbnail) {
            return asset('storage/post/' . $this->thumbnail);
        }
        return "https://via.placeholder.com/400x300?text=No+Image";
    }
    public function author()
    {
        return $this->belongsTo(User::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function likes()
    {
        return $this->belongsToMany(User::class, 'post_like');
    }
}
