<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FicheDescriptive extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'fichesDescriptives';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idFicheDescriptive',
        'dateCreation',
        'contenuStage',
        'thematique',
        'sujet',
        'fonctions',
        'taches',
        'competences',
        'details',
        'debutStage',
        'finStage',
        'nbJourSemaine',
        'nbHeureSemaine',
        'clauseConfidentialite',
        'statut',
        'numeroConvention'
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idFicheDescriptive';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
}
