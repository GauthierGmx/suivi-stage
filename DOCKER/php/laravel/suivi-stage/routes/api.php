<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import du contrôleur
use App\Http\Controllers\RechercheStageController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController; 
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\ParcoursController;
use App\Http\Controllers\TuteurEntrepriseController;
use App\Http\Controllers\AnneeUniversitaireController;
use App\Http\Controllers\PersonnelController;
use App\Http\Middleware\DispatchDataDescriptiveSheet;

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
Route::post('/fiche-descriptive/create', [FicheDescriptiveController::class, 'store'])->name('fiche-descriptive.store')->middleware('dispatch.data.descriptive.sheet');
Route::put('/fiche-descriptive/update/{id}', [FicheDescriptiveController::class, 'update'])->name('fiche-descriptive.update')->middleware('dispatch.data.descriptive.sheet');
Route::get('/fiche-descriptive/{id}', [FicheDescriptiveController::class, 'show'])->name('fiche-descriptive.show')->middleware('dispatch.data.descriptive.sheet');
Route::get('/fiche-descriptive', [FicheDescriptiveController::class, 'index'])->name('fiche-descriptive.index');
Route::delete('/fiche-descriptive/delete/{id}', [FicheDescriptiveController::class, 'destroy'])->name('fiche-descriptive.destroy');

// Route pour le Controller Etudiant
Route::get('/etudiants/{id}/recherches-stages', [EtudiantController::class, 'indexRechercheStage'])->name('etudiants.indexRechercheStage');
Route::get('/etudiants/{id}/fiches-descriptives', [EtudiantController::class, 'indexFicheDescriptive'])->name('etudiants.indexFicheDescriptive');
Route::get('/etudiants', [EtudiantController::class, 'index'])->name('etudiants.index');
Route::get('/etudiants/{id}', [EtudiantController::class, 'show'])->name('etudiants.show');

// Route pour le Controller Parcours
Route::get('/parcours', [ParcoursController::class, 'index'])->name('parcours.index');

// Route pour le Controller TuteurEntreprise
Route::get('/tuteur-entreprise/{id}', [TuteurEntrepriseController::class, 'show'])->name('tuteur-entreprise.show');
Route::post('/tuteur-entreprise/create', [TuteurEntrepriseController::class, 'store'])->name('tuteur-entreprise.store');
Route::put('/tuteur-entreprise/update/{id}', [TuteurEntrepriseController::class, 'update'])->name('tuteur-entreprise.update');
Route::get('/tuteur-entreprise', [TuteurEntrepriseController::class, 'index'])->name('tuteur-entreprise.index');

// Route pour le Controller AnneeUniversitaire
Route::get('/annee-universitaire', [AnneeUniversitaireController::class, 'index'])->name('annee-universitaire.index');
Route::post('/annee-universitaire/create', [AnneeUniversitaireController::class, 'store'])->name('annee-universitaire.store');
Route::get('/annee-universitaire/{id}', [AnneeUniversitaireController::class, 'show'])->name('annee-universitaire.show');
Route::put('/annee-universitaire/update/{id}', [AnneeUniversitaireController::class, 'update'])->name('annee-universitaire.update');
Route::delete('/annee-universitaire/delete/{id}', [AnneeUniversitaireController::class, 'destroy'])->name('annee-universitaire.destroy');

// Route pour le Controller Personnel
Route::get('/personnel', [PersonnelController::class, 'index'])->name('personnel.index');
Route::post('/personnel/create', [PersonnelController::class, 'store'])->name('personnel.store');
Route::get('/personnel/{id}', [PersonnelController::class, 'show'])->name('personnel.show');
Route::put('/personnel/update/{id}', [PersonnelController::class, 'update'])->name('personnel.update');
Route::delete('/personnel/delete/{id}', [PersonnelController::class, 'destroy'])->name('personnel.destroy');