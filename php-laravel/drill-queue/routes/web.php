<?php

use Illuminate\Support\Facades\Route;
use App\Models\Drill;

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

Route::get('/drills', function () {
    $drills = Drill::latest()->where('completed', false)->get();
    return view('index', ['drills' => $drills]);
})->name('drills.index');

Route::get('/drills/{id}', function($id) {
    $drill = Drill::findOrFail($id);
    return view('detail', ['drill' => $drill]);
})->name('drills.detail');

Route::fallback(function () {
    return redirect()->route('drills.index');
});
