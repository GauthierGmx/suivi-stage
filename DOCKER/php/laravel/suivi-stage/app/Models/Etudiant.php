<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Etudiant extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idUPPA',
        'nom',
        'prenom',
        'adresse',
        'ville',
        'codePostal',
        'telephone',
        'adresseMail',
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idUPPA';
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

    // Relation 1-N avec DepartementIUT
    public function departementIUT()
    {
        return $this->belongsTo(DepartementIUT::class);
    }

    // Relation 1-N avec Parcours
    public function parcours()
    {
        return $this->belongsTo(Parcours::class);
    }

    // Relation N-N avec Personnel
    public function personnels()
    {
        return $this->hasMany(Personnel::class);
    }

    // Relation N-N avec RechercheStage
    public function rechercheStages()
    {
        return $this->hasMany(RechercheStage::class);
    }

    // Relation N-N avec FicheDescriptive
    public function ficheDescriptives()
    {
        return $this->hasMany(FicheDescriptive::class);
    }

    // Relation N-N avec TP
    public function tps()
    {
        return $this->hasMany(TP::class);
    }

    // Relation N-N avec TD
    public function tds()
    {
        return $this->hasMany(TD::class);
    }

    // Relation N-N avec AnneeFormation
    public function anneeFormations()
    {
        return $this->hasMany(AnneeFormation::class);
    }

    // Relation N-N avec AnneeUniversitaire
    public function anneeUniversitaires()
    {
        return $this->hasMany(AnneeUniversitaire::class);
    }
}
