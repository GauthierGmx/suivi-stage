<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Personnel extends Model
{
    use HasFactory;
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idPersonnel',
        'roles',
        'nom',
        'prenom',
        'adresse',
        'ville',
        'codePostal',
        'telephone',
        'adresseMail',
        'longGPS',
        'latGPS',
        'coptaEtudiant'
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idPersonnel';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
}
