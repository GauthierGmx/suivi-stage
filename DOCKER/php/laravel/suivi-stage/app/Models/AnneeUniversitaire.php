<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnneeUniversitaire extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idAnneeUniversitaire',
        'libelle',
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idAnneeUniversitaire';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
    
    // Relation N-N avec AnneeFormation
    public function anneeFormations()
    {
        return $this->belongsToMany(AnneeFormation::class);
    }

    // Relation N-N avec Etudiant
    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class);
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

    // Relation N-N avec TD
    public function tds()
    {
        return $this->belongsToMany(TD::class);
    }

    // Relation N-N avec TP
    public function tps()
    {
        return $this->belongsToMany(TP::class);
    }
}
