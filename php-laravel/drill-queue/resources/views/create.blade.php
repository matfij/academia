@extends('layouts.app')

@section('title')
    <h2>Create a new Drill</h2>
@endsection

@section('content')
    {{ $errors }}
    <form method="POST" action="{{ route('drills.save') }}">
        @csrf
        <div>
            <label for="title">Tilte:</label>
            <input type="text" name="title" id="title">
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea rows="5" name="description" id="description"></textarea>
        </div>
        <div>
            <label for="hints">Hints:</label>
            <textarea rows="2" name="hints" id="hints"></textarea>
        </div>
        <div>
            <button type="submit">Create</button>
        </div>
    </form>
@endsection
