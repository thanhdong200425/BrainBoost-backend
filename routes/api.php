<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/sign-in', [AuthController::class, 'signIn']);
Route::post('/sign-up', [AuthController::class, 'signUp']);