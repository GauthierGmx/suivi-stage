<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnneeUniversitaire extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'anneesUniversitaire';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idAnneeUniversitaire',
        'libelle',
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idAnneeUniversitaire';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
}
