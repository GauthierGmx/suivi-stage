<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FicheDescriptive extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idFicheDescriptive',
        'dateCreation',
        'dateDerniereModification',
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
        'numeroConvention',
        'interruptionStage',
        'dateDebutInterruption',
        'dateFinInterruption',
        'personnelTechniqueDisponible',
        'materielPrete',
        'idEntreprise',
        'idTuteurEntreprise',
        'idUPPA'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idFicheDescriptive';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Entreprise
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    // Relation 1-N avec TuteurEntreprise
    public function tuteurEntreprise()
    {
        return $this->belongsTo(TuteurEntreprise::class);
    }

    // Relation 1-N avec Etudiant
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }
}
