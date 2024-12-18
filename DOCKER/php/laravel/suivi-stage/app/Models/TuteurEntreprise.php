<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TuteurEntreprise extends Model
{
    use HasFactory;
    // Définit le nom de la table dans la base de données
    protected $table = 'tuteursEntreprise';
    // Définit les attributs pouvant être remplis
    protected $fillable = [
        'idTuteur',
        'nom',
        'prenom',
        'telephone',
        'adresseMail',
        'fonction'
    ]
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idTuteur';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;
}
