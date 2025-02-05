<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import du contrôleur
use App\Http\Controllers\RechercheStageController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController; 


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Route pour le Controller RechercheStage
Route::post('/recherches-stages/create', [RechercheStageController::class, 'store'])->name('recherches-stages.store');

// Route pour le Controller Entreprise
Route::get('/entreprises', [EntrepriseController::class, 'index'])->name('entreprises.index');
Route::post('/entreprises/create', [EntrepriseController::class, 'store'])->name('entreprises.store');
Route::get('/entreprises/{id}', [EntrepriseController::class, 'show'])->name('entreprises.show');


// Route pour récupérer les données du formulaire d'une fiche descriptive au format JSON
Route::post('/fiche-descriptive/create', [FicheDescriptiveController::class, 'store'])->name('fiche-descriptive.create');
Route::post('/fiche-descrpitve/update', [FicheDescriptiveController::class, 'update'])->name('fiche-descriptive.update');
