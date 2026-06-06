<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('techBlog');
});
Route::get('/{any}', function () {
    return view('techBlog');
})->where('any', '.*');
