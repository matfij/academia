@extends('layouts.app')

@section('styles')
    <style>
        .error {
            color: red;
            font-size: 0, 0.8rem;
        }
    </style>
@endsection

@section('title')
    <h2>Edit an existing Drill</h2>
@endsection

@section('content')
    <form method="POST" action="{{ route('drills.update', ['drill' => $drill->id]) }}">
        @csrf
        @method('PUT')
        <div>
            <label for="title">Tilte:</label>
            <input type="text" name="title" id="title" value="{{ $drill->title }}">
            @error('title')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea rows="5" name="description" id="description">
                {{ $drill->description }}
            </textarea>
            @error('description')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="hints">Hints:</label>
            <textarea rows="2" name="hints" id="hints">
                {{ $drill->hints }}
            </textarea>
            @error('hints')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <button type="submit">Edit</button>
        </div>
    </form>
@endsection
