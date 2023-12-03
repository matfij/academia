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
    <h2>Create a new Drill</h2>
@endsection

@section('content')
    {{-- {{ $errors }} --}}
    <form method="POST" action="{{ route('drills.save') }}">
        @csrf
        <div>
            <label for="title">Tilte:</label>
            <input type="text" name="title" id="title">
            @error('title')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea rows="5" name="description" id="description"></textarea>\
            @error('description')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="hints">Hints:</label>
            <textarea rows="2" name="hints" id="hints"></textarea>
            @error('hints')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <button type="submit">Create</button>
        </div>
    </form>
@endsection
