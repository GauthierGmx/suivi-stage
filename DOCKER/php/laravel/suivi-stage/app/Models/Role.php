<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idRole',
        'libelle',
        'voirRechercheStageEtudiant',
        'voirFicheDescriptiveEtudiant',
        'extraireAttributionEnseignant',
        'modifierCoptaEtudiantEnseignant',
        'modifierParametresDepartement'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idRole';
    // Précise que la table ne contient pas de created_at
    public $timestamps = false;

    // Relation N-N avec Personnel
    public function personnels()
    {
        return $this->belongsToMany(Personnel::class);
    }

    // Relation N-N avec DepartementIUT
    public function departementiuts()
    {
        return $this->belongsToMany(DepartementIUT::class);
    }
}
