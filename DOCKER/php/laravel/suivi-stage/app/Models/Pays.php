<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pays extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idPays',
        'nomPays',
        'indicatifTelephonique',
        'nbNumero'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idPays';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Entreprise
    public function entreprises()
    {
        return $this->hasMany(Entreprise::class);
    }

    // Relation 1-N avec FicheDescriptives
    public function ficheDescriptives()
    {
        return $this->hasMany(FicheDescriptive::class);
    }
}
