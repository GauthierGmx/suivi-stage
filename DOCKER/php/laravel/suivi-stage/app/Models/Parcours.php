<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Parcours extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'parcours';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idParcours',
        'libelle',
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idParcours';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec DepartementIUT
    public function departementIUT()
    {
        return $this->belongsTo(DepartementIUT::class);
    }

    // Relation 1-N avec Etudiant
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }
}
