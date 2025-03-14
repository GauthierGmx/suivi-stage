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
        'login',
        'nom',
        'prenom',
        'adresse',
        'ville',
        'codePostal',
        'telephone',
        'adresseMail',
    ];

    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idUPPA';

    // Indique que la clé primaire n'est pas un entier auto-incrémenté
    public $incrementing = false;

    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Cast de l'idUPPA en string
    protected $casts = [
        'idUPPA' => 'string',
    ];

    // Relation 1-N avec DepartementIUT
    public function departementIUT()
    {
        return $this->belongsTo(DepartementIUT::class);
    }

    // Relation 1-N avec Entreprise
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    // Relation 1-N avec FicheDescriptive
    public function ficheDescriptives()
    {
        return $this->hasMany(FicheDescriptive::class);
    }

    // Relation 1-N avec RechercheStage
    public function rechercheStages()
    {
        return $this->hasMany(RechercheStage::class);
    }

    // Relation 1-N avec TuteurEntreprise
    public function tuteurEntreprise()
    {
        return $this->belongsTo(TuteurEntreprise::class);
    }

    // Relation N-N avec Parcours
    public function parcours()
    {
        return $this->belongsToMany(Parcours::class);
    }

    // Relation N-N avec Personnel
    public function personnels()
    {
        return $this->belongsToMany(Personnel::class);
    }

    // Relation N-N avec TP
    public function tps()
    {
        return $this->belongsToMany(TP::class);
    }

    // Relation N-N avec TD
    public function tds()
    {
        return $this->belongsToMany(TD::class);
    }

    // Relation N-N avec AnneeFormation
    public function anneeFormations()
    {
        return $this->belongsToMany(AnneeFormation::class);
    }

    // Relation N-N avec AnneeUniversitaire
    public function anneeUniversitaires()
    {
        return $this->belongsToMany(AnneeUniversitaire::class);
    }
}
