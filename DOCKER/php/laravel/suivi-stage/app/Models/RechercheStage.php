<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RechercheStage extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idRecherche',
        'dateCreation',
        'dateModification',
        'date1erContact',
        'typeContact',
        'nomContact',
        'prenomContact',
        'fonctionContact',
        'telephoneContact',
        'adresseMailContact',
        'dateRelance',
        'statut'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idParametre';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Etudiant
    public function etudiant()
    {
        return $this->belongsTo(Etudiant::class);
    }

    // Relation 1-N avec Entreprise
    public function entreprise()
    {
        return $this->belongsTo(Entreprise::class);
    }
}
