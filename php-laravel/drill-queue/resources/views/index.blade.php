@extends('layouts.app')

@section('title')
    <h2>My tasks</h2>
@endsection

@section('content')
    <section>
        <div>
            @forelse ($tasks as $task)
                <p>{{ $task->id }}. {{ $task->title }}</p>
                <a href="{{ route('tasks.detail', ['id' => $task->id]) }}">Detail</a>
            @empty
                <p>---</p>
            @endforelse
        </div>
    </section>
@endsection
