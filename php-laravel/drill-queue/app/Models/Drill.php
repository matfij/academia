<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Drill extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'hints'];

    protected $attributes= [
        'completed' => false,
    ];

    public function getRouteKeyName() {
        return 'id';
    }
}
