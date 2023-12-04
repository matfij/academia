@extends('layouts.app')

@section('title')
    @isset($drill)
        <h2>Edit Drill</h2>
    @else
        <h2>Create Drill</h2>
    @endisset
@endsection

@section('content')
    <form method="POST"
        action="{{ isset($drill) ? route('drills.update', ['drill' => $drill->id]) : route('drills.save') }}">
        @csrf
        @isset($drill)
            @method('PUT')
        @endisset
        <div>
            <label for="title">Tilte:</label>
            <input type="text" name="title" id="title" value="{{ $drill->title ?? old('title') }}">
            @error('title')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea rows="5" name="description" id="description">
            {{ $drill->description ?? old('description') }}
        </textarea>
            @error('description')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <label for="hints">Hints:</label>
            <textarea rows="2" name="hints" id="hints">
            {{ $drill->hints ?? old('hints') }}
        </textarea>
            @error('hints')
                <p class="error">{{ $message }}</p>
            @enderror
        </div>
        <div>
            <button type="submit">
                @isset($drill)
                    Update
                @else
                    Create
                @endisset
            </button>
        </div>
    </form>
@endsection
