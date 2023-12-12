<?php

use App\Http\Requests\DrillRequest;
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
    $drills = Drill::latest()->paginate(8);
    return view('index', ['drills' => $drills]);
})->name('drills.index');

Route::view('/drills/create', 'create')
    ->name('drills.create');

Route::get('/drills/{drill}/edit', function(Drill $drill) {
    return view('edit', ['drill' => $drill]);
})->name('drills.edit');

Route::get('/drills/{drill}', function(Drill $drill) {
    return view('detail', ['drill' => $drill]);
})->name('drills.detail');

Route::fallback(function () {
    return redirect()->route('drills.index');
});

Route::post('/drills', function (DrillRequest $request) {
    $drill = Drill::create($request->validated());
    return redirect()->route('drills.detail', ['drill' => $drill->id])->with('success', 'Drill created');
})->name('drills.save');

Route::put('/drills/{drill}', function (DrillRequest $request, Drill $drill) {
    $drill->update($request->validated());
    return redirect()->route('drills.detail', ['drill' => $drill->id])->with('success', 'Drill updated');
})->name('drills.update');

Route::delete('/drills/{drill}', function (Drill $drill) {
    $drill->delete();
    return redirect()->route('drills.index')->with('success', 'Drill deleted');
})->name('drills.destroy');

Route::put('drills/{drill}/toggle-complete', function (Drill $drill) {
    $drill->toggleComplete();
    return redirect()->back()->with('success', 'Drill updated');
})->name('drills.toggle-complete');
