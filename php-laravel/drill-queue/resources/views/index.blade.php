<h2>My tasks</h2>

<div>
    @forelse ($tasks as $task)
        <p>{{ $task->id }}. {{ $task->title }}</p>
        <a href="{{ route('tasks.detail', ['id' => $task->id]) }}">Detail</a>
    @empty
        <p>---</p>
    @endforelse
</div>
