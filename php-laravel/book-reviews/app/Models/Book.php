<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeTitle(Builder $query, $title): Builder
    {
        return $query->where('title', 'LIKE', '%' . $title . '%');
    }

    public function scopePopular(Builder $query, string $from = null, string $to = null): Builder
    {
        return $query->withCount([
            'reviews' => fn (Builder $q) => $this->dateRangeBuilder($q, $from, $to)
        ])->orderBy('reviews_count', 'desc');
    }

    public function scopeHighestRated(Builder $query, string $from = null, string $to = null): Builder
    {
        return $query->withAvg([
            'reviews' => fn (Builder $q) => $this->dateRangeBuilder($q, $from, $to)
        ], 'rating')->orderBy('reviews_avg_rating', 'desc');
    }

    public function scopeMinReviews(Builder $query, int $minReviews): Builder
    {
        return $query->having('reviews_count', '>=', $minReviews);
    }

    private function dateRangeBuilder(Builder $query, string $from = null, string $to = null)
    {
        if ($from && ! $to) {
            $query->where('created_at', '>=', $from);
        } elseif (!$from && $to) {
            $query->where('created_at', '<=', $to);
        } elseif ($from && $to) {
            $query->whereBetween('created_at', [$from, $to]);
        }
    }
}
