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
        'longitudeAdresse',
        'latitudeAdresse',
        'coptaEtudiant'
    ];
    // Définit l'attribut de la clé primaire
    protected $primaryKey = 'idPersonnel';
    // Précise que la table ne contient pas de created_at et updated_at
    public $timestamps = false;

    // Relation 1-N avec Admin
    public function admins()
    {
        return $this->hasMany(Admin::class);
    }

    // Relation N-N avec Droit
    public function droits()
    {
        return $this->belongsToMany(Droit::class);
    }

    // Relation N-N avec DepartementIUT
    public function departementIUTs()
    {
        return $this->belongsToMany(DepartementIUT::class);
    }

    // Relation N-N avec Etudiant
    public function etudiants()
    {
        return $this->belongsToMany(Etudiant::class);
    }

    // Relation N-N avec Role
    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }
}
