<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DepartementIUT extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'departementsIUT';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idDepartement',
        'libelle',
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idDepartement';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Parcours
    public function parcours()
    {
        return $this->hasMany(Parcours::class);
    }

    // Relation 1-N avec Etudiant
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

    // Relation N-N avec Personnel
    public function personnels()
    {
        return $this->belongsToMany(Personnel::class);
    }
}
