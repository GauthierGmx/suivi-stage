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
        'codeParcours',
        'libelle',
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'codeParcours';
    public $incrementing = false; // Précise que la clé primaire n'est pas auto-incrémentée pour éviter les conflits
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec DepartementIUT
    public function departementIUT()
    {
        return $this->belongsTo(DepartementIUT::class);
    }

    // Relation N-N avec Etudiant
    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class);
    }

    // Relation N-N avec AnneeUniversitaire
    public function anneeUniversitaires()
    {
        return $this->belongsToMany(AnneeUniversitaire::class);
    }
}
