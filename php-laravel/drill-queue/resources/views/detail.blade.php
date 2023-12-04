@extends('layouts.app')

@section('title')
    <h1>{{ $drill->title }}</h1>
@endsection

@section('content')
    <section>
        <p><b>About:</b> {{ $drill->description }}</p>
        @if ($drill->hints)
            <p><b>Hint:</b> {{ $drill->hints }}</p>
        @else
            <p><b>Hint:</b> ---</p>
        @endif
        <p><b>Created at:</b> {{ $drill->created_at }}</p>
        <form action="{{ route('drills.destroy', ['drill' => $drill->id]) }}" method="POST">
            @csrf
            @method('DELETE')
            <button type="submit">Delete</button>
        </form>
    </section>
@endsection
