<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
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

Route::view('/drills/create', 'create')
    ->name('drills.create');

Route::get('/drills/{id}', function($id) {
    $drill = Drill::findOrFail($id);
    return view('detail', ['drill' => $drill]);
})->name('drills.detail');

Route::fallback(function () {
    return redirect()->route('drills.index');
});

Route::post('/drills', function (Request $request) {
    $data = $request->validate([
        'title' => 'required|max:255',
        'description' => 'required',
        'hints' => 'required',
    ]);
    $drill = new Drill;
    $drill->title = $data['title'];
    $drill->description = $data['description'];
    $drill->hints = $data['hints'];
    $drill->completed = false;
    $drill->save();
    return redirect()->route('drills.detail', ['id' => $drill->id])->with('success','Drill created');
})->name('drills.save');
