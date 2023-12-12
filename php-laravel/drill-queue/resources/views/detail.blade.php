@extends('layouts.app')

@section('title')
    <h1>{{ $drill->title }}</h1>
@endsection

@section('content')
    <section>
        <p><b>About:</b> {{ $drill->description }}</p>
        <p><b>Status:</b> {{ $drill->completed ? 'Done' : 'Pending' }}</p>
        @if ($drill->hints)
            <p><b>Hint:</b> {{ $drill->hints }}</p>
        @else
            <p><b>Hint:</b> ---</p>
        @endif
        <hr>
        <p><b>Created at:</b> {{ $drill->created_at }}</p>
        <div>
            <a href="{{ route('drills.edit', ['drill' => $drill]) }}">Edit</a>
        </div>
        <hr>
        <form action="{{ route('drills.toggle-complete', ['drill' => $drill]) }}" method="POST">
            @csrf
            @method('PUT')
            <button type="submit">
                Mark as {{ $drill->completed ? 'not completed' : 'completed' }}
            </button>
        </form>
        <hr>
        <form action="{{ route('drills.destroy', ['drill' => $drill]) }}" method="POST">
            @csrf
            @method('DELETE')
            <button type="submit">Delete</button>
        </form>
    </section>
@endsection
