<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TD extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'TDs';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idTD',
        'libelle',
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idTD';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation N-N avec Etudiant
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

    // Relation N-N avec AnneeUniversitaire
    public function anneeUniversitaires()
    {
        return $this->hasMany(AnneeUniversitaire::class);
    }
}
