@extends('layouts.app')

@section('title')
    <h1>{{ $task->title }}</h1>
@endsection

@section('content')
    <section>
        <p>About: {{ $task->description }}</p>
        @if ($task->long_description)
            <p>Details: {{ $task->long_description }}</p>
        @else
            <p>Details: ---</p>
        @endif
        <p>Created at: {{ $task->created_at }}</p>
    </section>
@endsection
