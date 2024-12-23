<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TuteurEntreprise extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idTuteur',
        'nom',
        'prenom',
        'telephone',
        'adresseMail',
        'fonction'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idTuteur';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec FicheDescriptive
    public function ficheDescriptives()
    {
        return $this->hasMany(FicheDescriptive::class);
    }

    // Relation 1-N avec Entreprise
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }

    // Relation 1-N avec Etudiant
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
}
