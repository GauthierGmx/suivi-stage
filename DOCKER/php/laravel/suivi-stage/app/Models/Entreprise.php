<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idEntreprise',
        'numSIRET',
        'raisonSociale',
        'typeEtablissement',
        'adresse',
        'ville',
        'codePostal',
        'telephone',
        'codeAPE_NAF',
        'statutJuridique',
        'effectif',
        'nomRepresentant',
        'prenomRepresentant',
        'adresseMailRepresentant',
        'telephoneRepresentant',
        'fonctionRepresentant',
        'longitudeAdresse',
        'latitudeAdresse',
        'idPays',
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idEntreprise';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
    
    // Relation 1-N avec Etudiant
    public function etudiants()
    {
        return $this->hasMany(Etudiant::class);
    }

    // Relation 1-N avec FicheDescriptive
    public function ficheDescriptives()
    {
        return $this->hasMany(FicheDescriptive::class);
    }

    // Relation 1-N avec TuteurEntreprise
    public function tuteurEntreprises()
    {
        return $this->hasMany(TuteurEntreprise::class);
    }

    // Relation 1-N avec RechercheStage
    public function rechercheStages()
    {
        return $this->hasMany(RechercheStage::class);
    }

    // Relation 1-N avec Pays
    public function pays()
    {
        return $this->belongsTo(Pays::class);
    }
}
