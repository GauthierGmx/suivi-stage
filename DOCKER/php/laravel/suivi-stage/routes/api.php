<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import du contrôleur
use App\Http\Controllers\RechercheStageController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController; 
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\AuthController;

// Import du middleware du CAS
use App\Http\Middleware\CasAuthMiddleware;

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

// Route du middleware du CAS
Route::get('/cas-auth', function (Request $request) {
    $middleware = new CasAuthMiddleware();
    return $middleware->handle($request, function ($request) {
        return redirect()->away(env('ANGULAR_URL'));
    });
});

// Route pour le Controller Auth
Route::get('/get-authenticated-user', [AuthController::class, 'getUser']);

// Route pour le Controller RechercheStage
Route::get('/recherches-stages', [RechercheStageController::class, 'index'])->name('recherches-stages.index');
Route::post('/recherches-stages/create', [RechercheStageController::class, 'store'])->name('recherches-stages.store');
Route::get('/recherches-stages/{id}', [RechercheStageController::class, 'show'])->name('recherches-stages.show');
Route::put('/recherches-stages/update/{id}', [RechercheStageController::class, 'update'])->name('recherches-stages.update');
Route::delete('/recherches-stages/delete/{id}', [RechercheStageController::class, 'destroy'])->name('recherches-stages.destroy');

// Route pour le Controller Entreprise
Route::get('/entreprises', [EntrepriseController::class, 'index'])->name('entreprises.index');
Route::post('/entreprises/create', [EntrepriseController::class, 'store'])->name('entreprises.store');
Route::get('/entreprises/{id}', [EntrepriseController::class, 'show'])->name('entreprises.show');

// Route pour le Controller FicheDescriptive
Route::post('/fiche-descriptive/create', [FicheDescriptiveController::class, 'store'])->name('fiche-descriptive.store');
Route::put('/fiche-descriptive/update/{id}', [FicheDescriptiveController::class, 'update'])->name('fiche-descriptive.update');
Route::get('/fiche-descriptive/{id}', [FicheDescriptiveController::class, 'show'])->name('fiche-descriptive.show');
Route::get('/fiche-descriptive', [FicheDescriptiveController::class, 'index'])->name('fiche-descriptive.index');

// Route pour le Controller Etudiant
Route::get('/etudiants/{id}/recherches-stages', [EtudiantController::class, 'indexRechercheStage'])->name('etudiants.indexRechercheStage');
Route::get('/etudiants/{id}/fiches-descriptives', [EtudiantController::class, 'indexFicheDescriptive'])->name('etudiants.indexFicheDescriptive');
Route::get('/etudiants', [EtudiantController::class, 'index'])->name('etudiants.index');
Route::get('/etudiants/{id}', [EtudiantController::class, 'show'])->name('etudiants.show');