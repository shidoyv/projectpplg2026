<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudioCantingController;

Route::prefix('batik')->group(function () {
    Route::get('/', [StudioCantingController::class, 'index']);
    Route::post('/', [StudioCantingController::class, 'store']);
    Route::get('/{id}', [StudioCantingController::class, 'show']);
    Route::delete('/{id}', [StudioCantingController::class, 'destroy']);
});
