@extends('layouts.app')

@section('title')
    <h2>Pending Drills</h2>
@endsection

@section('content')
    <section>
        <div>
            <a href="{{ route('drills.create') }}">Create</a>
        </div>
        <div>
            @forelse ($drills as $drill)
                <p>{{ $drill->id }}. {{ $drill->title }}</p>
                <a href="{{ route('drills.detail', ['drill' => $drill->id]) }}">Detail</a>
            @empty
                <p>---</p>
            @endforelse
        </div>
    </section>
    <nav>
        @if ($drills->count())
            {{ $drills->links() }}
        @endif
    </nav>
@endsection
