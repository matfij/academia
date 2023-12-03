<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>PHP Drill Queue</title>
    @yield('styles')
</head>

<body>
    @if (session()->has('success'))
        <div>{{ session('success') }}</div>
    @endif
    <header>
        @yield('title')
    </header>
    <main>
        @yield('content')
    </main>
</body>

</html>
