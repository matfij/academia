@extends('layouts.app')

@section('title')
    <h2>Pending Drills</h2>
@endsection

@section('content')
    <section>
        <nav class="mb-4">
            <a href="{{ route('drills.create') }}" class="font-medium text-gray-700 underline decoration-pink-500">Create</a>
        </nav>
        <div>
            @forelse ($drills as $drill)
                <p @class(['line-through' => $drill->completed])>{{ $drill->id }}. {{ $drill->title }}</p>
                <a href="{{ route('drills.detail', ['drill' => $drill->id]) }}">Detail</a>
            @empty
                <p>---</p>
            @endforelse
        </div>
    </section>
    <nav class="mt-4">
        @if ($drills->count())
            {{ $drills->links() }}
        @endif
    </nav>
@endsection
