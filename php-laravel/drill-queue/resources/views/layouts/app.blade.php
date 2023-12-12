<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PHP Drill Queue</title>
    <script src="https://cdn.tailwindcss.com"></script>
    @yield('styles')
</head>

<body class="container max-w-lg mx-auto my-10">
    @if (session()->has('success'))
        <div>{{ session('success') }}</div>
    @endif
    <header class="text-2xl mb-2">
        @yield('title')
    </header>
    <main>
        @yield('content')
    </main>
</body>

</html>
