@extends('layouts.app')
@section('content')
    <section>
        <h1 class="mb-10 text-2xl">Book Lib</h1>
        <form method="GET" action="{{ route('books.index') }}" class="flex gap-2 mb-4">
            <input type="hidden" name="filter" value="{{ request('filter') }}">
            <input name="title" value="{{ request('title') }}" type="text" placeholder="Search by title" class="input" />
            <button type="submit" class="btn">Search</button>
            <a href="{{ route('books.index') }}" class="btn">Clear</a>
        </form>
        <div class="filter-container flex mb-4">
            @php
                $filters = [
                    '' => 'Latest',
                    'trending' => 'Trending',
                    'highest_rated' => 'Highest Rated',
                ];
            @endphp
            @foreach ($filters as $filter => $label)
                <a href="{{ route('books.index', [...request()->query(), 'filter' => $filter]) }}"
                    class="{{ request('filter') === $filter || (request('filter') === null && $filter === '') ? 'filter-item-active' : 'filter-item' }}">
                    {{ $label }}
                </a>
            @endforeach
        </div>
        <ul>
            @forelse ($books as $book)
                <li class="mb-4 book-item flex flex-wrap items-center justify-between">
                    <div class="w-full flex-grow sm:w-auto">
                        <a href="{{ route('books.show', $book) }}" class="book-title">{{ $book->title }}</a>
                        <span class="book-author">{{ $book->author }}</span>
                    </div>
                    <div>
                        <div class="book-rating">
                            {{ number_format($book->reviews_avg_rating, 1) }}
                        </div>
                        <div class="book-review-count">
                            out of {{ $book->reviews_count }} {{ Str::plural('review', $book->reviews_count) }}
                        </div>
                    </div>
                </li>
            @empty
                <li class="mb-4 empty-book-item">
                    <p class="empty-text">No books found</p>
                    <a href="{{ route('books.index') }}" class="reset-link">Reset criteria</a>
                </li>
            @endforelse
        </ul>
    </section>
@endsection
