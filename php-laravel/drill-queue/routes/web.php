<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return 'PHP for the win!';
});

Route::get('/legacy', function () {
    return redirect('/test');
})->name('legacy');

Route::get('/unknown', function () {
    return redirect()->route('legacy');
});

Route::get('/find/{name}', function ($name) {
    return 'User ' . $name . ' found.';
});

Route::fallback(function () {
    return 'No content';
});
