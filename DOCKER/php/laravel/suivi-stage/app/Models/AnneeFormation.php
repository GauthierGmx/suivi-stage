<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnneeFormation extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idAnneeFormation',
        'libelle',
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idAnneeFormation';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

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
